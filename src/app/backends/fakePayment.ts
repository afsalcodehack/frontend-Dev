import { backendEvent } from '../backend';

export const handlePayment = ({ body }) => {
  backendEvent.next({ name: 'payment:success', data: body });
  const charge = {
    amount: body.price,
    currency: body.currency,
    description: `Charge for ${body.item_type} ${body.item_id}`,
    source: body.token,
  };
  console.log('Created stripe charge', charge);
};
