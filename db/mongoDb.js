import { connect } from 'mongoose';
const uri = "mongodb+srv://admin:admin@cluster0.xikqfmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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
