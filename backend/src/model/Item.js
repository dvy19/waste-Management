const mong=require("mongoose")

const item=new mong.Schema({

    user:{
        type:mong.Schema.Types.ObjectId,
        required:true,
        ref:"UserProfile"
    },

    name:String,

    trackingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    quantity:Number,

    weight:Number,

    category:{
        type:String,
        enum:[ "dry",
            "wet",
            "food",
            "garden",
            "electrical",
            "plastic",
            "paper",
            "metal",
            "other"
        ]
    },

    status:{
        type:String,
        enum:['submitted' , 'collected' , 'processed']
    },

    processingMethod: {
        type: String,
        enum: [
            "reused",
            "recycled",
            "composted",
            "donated",
            "disposed"
        ]
    },


    },

    { timestamps: true }
)



const Item=mong.model("Item" , item)

module.exports=Item