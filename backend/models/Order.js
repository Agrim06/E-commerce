import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true }, 
    image : { type: String},
    price: { type: Number, required: true },
    product: { type : mongoose.Schema.Types.ObjectId , ref : "Product" , required : true},
},
    { _id: false }
);

const shippingAddressSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true},
    orderItems : [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;