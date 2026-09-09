const mong=require("mongoose")


const adminDetailsSchema = new mong.Schema(
  {
    user: {
      type: mong.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    address: {
      type: String
    },

    title:String,

    bio:String,
  },
  {
    timestamps: true
  }
);

const AdminDetails = mong.model("AdminDetails", adminDetailsSchema);

module.exports = {
  AdminDetails
};