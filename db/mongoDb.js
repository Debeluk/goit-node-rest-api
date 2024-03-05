import { connect } from 'mongoose';
import 'dotenv/config';
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error", error);
    process.exit(1);
  }
};

export default connectDB;
