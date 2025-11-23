import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
export const getProducts = asyncHandler(async(req, res) =>{
    const keyword = req.query.keyword
    ? {
        name: {
            $regex: req.query.keyword, $options: "i",
        },
    }
    : {};
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);  
    if(product) res.json(product);
    else{
        res.status(404);
        throw new Error("Product not found");
    }
});

// @desc   Admin create a product
// @route  POST /api/products
// @access Private/Admin
export const createProduct = asyncHandler(async(req, res) =>{
    const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc   Admin update product
// @route  PUT /api/products/:id
// @access Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price ?? product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock ?? product.countInStock;
    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc   Admin delete product
// @route  DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
