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

const saleItem=new mong.Schema({

  image:String,

  price:Number,
  name:String,

  quantity:Number,

  materials:{
    type:[String]
  },

  manufacturer:String,

  about:String,

  tag:{
    type:String,
    enum:['recycled' , 'reused' , 'handicraft']
  }
})

const centres=new mong.Schema({

  name:String,

  coordinates:{
    type:[Number]
  },

  address:String,

  pinCode:String,

  material:String,
  contact:String,

  owner:String,
  image:String,

  about:String,
})

const SaleItem=mong.model("SaleItem" , saleItem)
const AdminDetails = mong.model("AdminDetails", adminDetailsSchema);

const Centres=mong.model("Centres" , centres)

module.exports = {
  AdminDetails,
  Centres,
  SaleItem
};