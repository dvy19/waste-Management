const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user"],
      default: "user"
    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const userDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    address: {
      type: String
    },

    profile: {
      type: String
    },

    city: {
      type: String
    },

    pinCode: {
      type: String
    },

    houseNo: {
      type: String
    },

    coordinates: {
      type: [Number]
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = {
  User,
  UserDetails
};