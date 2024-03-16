import bcrypt from "bcryptjs";
import User from "../schemas/userSchema.js";
import { authSchema } from "../schemas/validateSchemas.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { sendVerificationEmail } from "../middleware/emailService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
    await sendVerificationEmail(email, user.verificationToken);
    res.status(201).json({ message: "Please verify your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = authSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!user.verify) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
    avatarURL: req.user.avatarURL,
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const updateAvatar = async (req, res) => {
  try {
    const { path: tempPath, originalname } = req.file;
    const { _id: userId } = req.user;

    const avatar = await Jimp.read(tempPath);
    await avatar.resize(250, 250);

    const filePath = path.join(
      path.dirname(__dirname),
      "public/avatars",
      `${userId}${path.extname(originalname)}`
    );
    await avatar.writeAsync(filePath);

    const avatarURL = `/avatars/${userId}${path.extname(originalname)}`;
    await User.findByIdAndUpdate(userId, { avatarURL });

    await fs.unlink(tempPath);

    res.json({ avatarURL });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.avatarURL) {
      return res.status(404).json({ message: "User or avatar not found" });
    }

    const avatarPath = path.join(
      path.dirname(__dirname),
      "public",
      user.avatarURL
    );

    try {
      await fs.access(avatarPath);
      await fs.unlink(avatarPath);
    } catch (error) {
      console.log("Avatar file does not exist, skipping removal.");
    }

    user.avatarURL = "/avatars/default.jpg";
    await user.save();

    res.json({
      message: "Avatar has been deleted successfully",
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verify = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verificationLink = `${process.env.BACKEND_URL}/users/verify/${user.verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
