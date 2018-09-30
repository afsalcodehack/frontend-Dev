import { products } from './fakeProducts';

export const handlePayment = (req) => {
  const product = products.find(({ id }) => id === req.body.product_id);
  if (!product) {
    console.log('Product not found');
    return;
  }

  const token = req.body.token;
  const charge = {
    amount: product.price,
    currency: product.currency,
    description: `Charge for ${product.name}`,
    source: token,
  };
  console.log('Created stripe charge', charge);
};
