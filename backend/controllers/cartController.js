import asyncHandler from "express-async-handler";
import Cart from "../models/Cart";


// GET cart
export const getcart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product",
        "name price image"
    );

    if(!cart){
        return res.json({ items: [] });
    }

    res.json(cart);
})

// add items
export const addToCart = asyncHandler(async (req, res)=> {
    const { productId , qty } = req.body;

    let cart = await Cart.findOne({ user: req.user._id })
    if(!cart){
        cart = new Cart({ user : req.user._id , items: [] });
    }

    const existingItem = cart.items.find(
       (item) => item.product.toString() === productId
    );

    if(existingItem){
        existingItem.qty += qty;
    }else{
        cart.items.push({
            product : productId,
            qty,
        });
    }
    await cart.save();
    res.json(cart);
});

export const removeFromCart = async(req, res)=> {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if(!cart){
        res.status(404);
        console.log("Cart not found!");
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() != productId
    );

    await cart.save();
    res.json();
}

export const clearCart = async(req, res) =>{
    await cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared" });
};