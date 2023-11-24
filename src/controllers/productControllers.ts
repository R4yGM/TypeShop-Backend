import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/productModel";
import axios from 'axios';

// @desc    Fetch 12 products
// @route   GET /api/products
// @access  Public
export const getProductList = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await Product.find({}).limit(12);

    if (products) {
      res.status(200).json(products);
    } else {
      res.status(500);
      throw new Error("products not found!");
    }
  }
);

// @desc   Fetch all products with pages for pagination category brand for filter and searchQuery for search
// @route   GET /api/products/search
// @access  Public

export const getProductSearch = asyncHandler(
  async (req: Request, res: Response) => {
    const pageSize: any = req.query.pageSize || 9;
    const page: any = req.query.page || 1;

    const category = req.query.category || "";
    const brand = req.query.brand || "";
    const searchQuery = req.query.query || "";

    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    const categoryFilter = category && category !== "all" ? { category } : {};
    const brandFilter = brand && brand !== "all" ? { brand } : {};

    const categories = await Product.find({}).distinct("category");
    const brands = await Product.find({}).distinct("brand");
    const productDocs = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
    })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .lean();

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...brandFilter,
    });

    res.status(200).json({
      countProducts,
      productDocs,
      categories,
      brands,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  }
);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(400);
      throw new Error("product not found!");
    }
  }
);

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, image, pandabuy_url, brand, category, price, qty } = req.body;

  try {
    // Make a GET request to the pandabuy_url
    const headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, compress, deflate, br',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
      'X-Amzn-Trace-Id': 'Root=1-643d15cc-231af09d4e31bc6e4a198345'
    }
    const response = await axios.get(pandabuy_url , {
      headers: headers
    });

    // Extract the 'Location' header from the response
    const pandalink = response.request.res.responseUrl;
    console.log(response.request)

    // Create a new Product instance with the retrieved data and the 'Location' header
    const product = new Product({
      name,
      image,
      pandabuy_url,
      brand,
      category,
      price,
      qty,
      pandabuy_affiliate: pandalink,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    console.log(error);
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(400).json({ message: 'Duplicate key error.' });
    } else {
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);

    if (product) {
      res.status(200).json("Product has been updated");
    } else {
      res.status(400);
      throw new Error("products not found!");
    }
  }
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.status(200).json("Product has been deleted");
    } else {
      res.status(400);
      throw new Error("products not found!");
    }
  }
);

// @desc    Create review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req: any, res: Response) => {
  const { comment, rating } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const exist = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (exist) {
      res.status(400).json({ message: "You have already reviewed this product" });
    } else {
      const review = {
        name: req.user.name as string,
        rating,
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      await product.save();

      res.status(201).json(product.reviews);
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
