import { Schema, model, Types } from 'mongoose';

type CartItems = {
    price: number;
    name: string;
    qty: number;
    image: string;
    _id: Types.ObjectId;
    pandabuy_url: string;
  };

  interface ICart {
    user: Types.ObjectId;
    cartItems: CartItems[];
    totalPrice: number;
  }

  const cartSchema = new Schema<ICart>(
    {
      user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      cartItems: [
        {
          name: { type: String, required: true },
          qty: { type: Number, required: true },
          image: { type: String, required: true },
          price: { type: Number, required: true },
          pandabuy_url: { type: String, required: true },
          _id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
        },
      ],
      totalPrice: { type: Number, required: true, default: 0.0 },
    },
    {
      timestamps: true,
    }
  );

  const Cart = model<ICart>('Cart', cartSchema);

  export default Cart;