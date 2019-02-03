export const bookings = [
  {
    id: 1,
    name: 'Sylt',
    city: 'Hamburg',
    image: 'https://gitlab.viperdev.io/yujet/frontend/uploads/6ceac83b898dd44f5ab0bc41e652c2fe/photo-1526918761918-da528d9558c5.jpeg',
    openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    boards: [
      {
        name: 'regular',
        number: 3,
      },
      {
        name: 'long board SUP',
        number: 1,
      },
      {
        name: 'catamaran',
        number: 5,
      },
    ],
    timeslots: [
      {
        startTime: '8:00',
        endTime: '8:30',
      },
      {
        startTime: '8:45',
        endTime: '9:15',
      },
    ],
  },
  {
    id: 2,
    name: 'Fehmarn Island',
    city: 'Hamburg',
    image: 'https://gitlab.viperdev.io/yujet/frontend/uploads/e44c8a5354dbc1b853bf5be9e6e6c606/photo-1495819427834-1954f20ebb97.jpeg',
    openDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    boards: [
      {
        name: 'regular',
        number: 2,
      },
    ],
    timeslots: [
      {
        startTime: '8:00',
        endTime: '8:30',
      },
      {
        startTime: '8:45',
        endTime: '9:15',
      },
    ],
  },
  {
    id: 3,
    name: 'Chiemsee',
    city: 'Munich',
    image: 'https://gitlab.viperdev.io/yujet/frontend/uploads/d542ddc5c73f9ec6c3ea5a2c3bbe3d77/photo-1538225800205-56ceb5d3459c.jpeg',
    openDays: ['Saturday', 'Sunday'],
    boards: [
      {
        name: 'regular',
        number: 10,
      },
      {
        name: 'catamaran',
        number: 5,
      },
    ],
    timeslots: [
      {
        startTime: '8:00',
        endTime: '8:30',
      },
      {
        startTime: '8:45',
        endTime: '9:15',
      },
    ],
  },
];

export const orders = [
  {
    orderId: 'fakeOrderId1',
    locationId: 1,
    customerName: 'Alice',
    orderItems: [
      {
        boardType: 'regular',
        productId: 'fakeProductId1',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:00',
          endTime: '8:30',
        },
        status: {
          board: 'booked',
        },
      },
      {
        boardType: 'regular',
        productId: 'fakeProductId2',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:00',
          endTime: '8:30',
        },
        status: {
          board: 'booked',
        },
      },
    ],
  },
  {
    orderId: 'fakeOrderId3',
    locationId: 1,
    customerName: 'Bob',
    orderItems: [
      {
        boardType: 'regular',
        productId: 'fakeProductId3',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:00',
          endTime: '8:30',
        },
        status: {
          board: 'booked',
        },
      },
    ],
  },
  {
    orderId: 'fakeOrderId4',
    locationId: 1,
    customerName: 'Alex',
    orderItems: [
      {
        boardType: 'regular',
        productId: 'fakeProductId1',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:45',
          endTime: '9:15',
        },
        status: {
          board: 'booked',
        },
      },
    ],
  },
  {
    orderId: 'fakeOrderId5',
    locationId: 1,
    customerName: 'Betty',
    orderItems: [
      {
        boardType: 'regular',
        productId: 'fakeProductId2',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:45',
          endTime: '9:15',
        },
        status: {
          board: 'booked',
        },
      },
    ],
  },
  {
    orderId: 'fakeOrderId6',
    locationId: 1,
    customerName: 'Alice',
    orderItems: [
      {
        boardType: 'long board SUP',
        productId: 'fakeProductId4',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:00',
          endTime: '8:30',
        },
        status: {
          board: 'booked',
        },
      },
    ],
  },
  {
    orderId: 'fakeOrderId7',
    locationId: 1,
    customerName: 'Charlie',
    orderItems: [
      {
        boardType: 'long board SUP',
        productId: 'fakeProductId4',
        date: '2019-01-01',
        timeslot: {
          startTime: '8:45',
          endTime: '9:15',
        },
        status: {
          board: 'booked',
        },
      },
    ],
  },
];

export const toPayableOrder = (order) => {
  const fakeType = order.items[0].type;
  const fakeOrder = {
    quantity: 2,
    product: `${fakeType} Surfboards`,
    category: `Lifestyle Surf - ${order.name}, ${order.city}`,
    charges: [
      { type: 'Rental', amount: 400 },
      { type: 'Deposit', amount: 120 },
    ],
    ...order,
  };

  fakeOrder.timeslot = fakeOrder.timeslots[0] || {
    startTime: '8:45',
    endTime: '9:15',
  };

  return fakeOrder;
};

export const getOrderFromId = (id) => {
  return orders.find((order) => order.orderId === id);
};

export const updateOrderItemStatus = (orderId, productId, status) => {
  const order = getOrderFromId(orderId);

  switch (status.board) {
    case 'released': status.releaseTime = new Date(); break;
    case 'returned': status.returnTime = new Date(); break;
  }

  if (order) {
    order.orderItems.forEach((item, key) => {
      if (item.productId === productId) {
        order.orderItems[key]['status'] = {
          ...item.status,
          ...status,
        };
      }
    });
  }
};
