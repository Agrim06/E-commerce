import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    name: { type: String },
    rating: { type: Number},
    comment: { type: String},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},
    { timestamp : true }
);

const productSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    name : {
        type : String,
        required : true,
    },
    image : {
        type : String,
    },
    brand : {
        type : String,
    },
    category : {
        type : String
        },
    description : {
        type : String,
        },
    price: {
        type : Number,
        required : true,
        default : 0,
    },
    countInStock : {
        type : Number,
        required : true,
        default : 0,
    },
    rating : {
        type : Number,
        required : true,
        default : 0,
    },
    numReviews : {
        type : Number,
        required : true,
        default : 0,
    },
     reviews : [reviewSchema],
}, { timestamp : true }
);

const Product = mongoose.model("Product" , productSchema);

export default Product; 