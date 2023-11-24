import { Schema, model, Types } from "mongoose";

type Review = {
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
};

interface IProduct {
  name: string;
  image: string;
  price: number;
  pandabuy_url: string;
  pandabuy_affiliate: string;
  category: string;
  brand: string;
  qty?: number;
  reviews: Review[];
  // _id: string;
}


const reviewSchema = new Schema<Review>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    pandabuy_url: { type: String, required: true },
    pandabuy_affiliate: { type: String, required: true },
    qty: Number,
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
