import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
export const getProducts = asyncHandler(async(req, res) =>{
    const keyword = req.query.keyword || "";
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;
    const featured = req.query.featured;

    let filter = {};

    if(keyword.trim()){
      const q = escapeRegex(keyword.trim());
      const regex = { $regex: q, $options: "i" };
      filter.$or = [
          { name: regex },
          { category: regex },
          { brand: regex },
      ];
    }

    // Handle featured filter - must be explicitly true
    if(featured === "true" || featured === true || featured === "1"){
      // Only return products where isFeatured is explicitly true
      // This will NOT match documents where isFeatured is false, null, or missing
      filter.isFeatured = true;
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), count });
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
    const {
      name, 
      price,
      countInStock,
      image,
      brand,
      category,
      description,
      isFeatured
    } = req.body;

    if(!name || !price ){
      res.status(400);
      throw new Error("Name and price details are required");
    }

    const product = new Product({
      name,
      price,
      countInStock: countInStock ?? 0,
      image: image || "/images/default-product.jpg",
      brand: brand || "Generic",
      category: category || "General",
      description: description || "No description",
      user: req.user._id,
      isFeatured : !!isFeatured,
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
