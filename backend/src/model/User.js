const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user" , "admin"],
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

    firebaseUid: {
        type: String,
        unique: true,
        sparse: true
      },

      phoneNumber: {
          type: String,
          unique: true,
          sparse: true
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

    coordinates: {
      type: [Number]
    }
  },
  {
    timestamps: true
  }
);


const userStats=new mongoose.Schema({

  itemsAdded:{
    type:Number,
    default:0
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    unique:true
  },

  points:{
    type:Number,
    default:0
  }

});

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  discount: {
    type: Number,
    default: 20
  },

  isUsed: {
    type: Boolean,
    default: false
  },

  expiresAt: Date
});

const userOrder=new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SaleItem",
        required: true
  },

  quantity: {
        type: Number,
        required: true
  },

  amount: {
        type: Number,
        required: true
  },

  idempotencyKey: {
        type: String,
        required: true,
        unique: true
  },

  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CouponSchema"
}

});


const orderStats=mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"UserDetails"
  },

  orders: {
        type: Number,
        default: 0
  },

    spent: {
        type: Number,
        default: 0
    },

    couponUsed: {
        type: Number,
        default: 0
    },

    items: {
        type: Number,
        default: 0
    }

})

const OrderStats=mongoose.model("OrderStats" , orderStats)
const OrderSchema=mongoose.model("OrderSchema" , userOrder)
const CouponSchema=mongoose.model("CouponSchema" , couponSchema)
const UserStats=mongoose.model("UserStats" , userStats)
const User = mongoose.model("User", userSchema);
const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

module.exports = {
  User,
  UserDetails,
  UserStats,
  OrderSchema,
  CouponSchema,
  OrderStats
  
};