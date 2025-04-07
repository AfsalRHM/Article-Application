import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    preferences: {
      type: Array,
      required: true,
    },
    blocked_articles: {
      type: [String],
      default: [],
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
