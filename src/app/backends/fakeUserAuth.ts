import { auth } from '../constants';

import { isInsideBounds } from '../backends/map.functions';

const getFakeJwtToken = (i) => `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58${i}`;

const fakeUsers = [
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Userman',
    email: 'alice@example.com',
    password: '123456',
    verified: true,
    role: auth.roles[0],
    token: getFakeJwtToken(0),
    bio: 'I\'m a plumber. I can install your dishwasher and so on.',
    image: '',
    city: 'Hamburg',
    country: 'Germany',
    profession: 'Plumber',
    disclose_location: true,
    latitude: '53.46640321102844',
    longitude: '9.977127156036431',
  },
  {
    id: 2,
    first_name: 'Bob',
    last_name: 'Userman',
    email: 'bob@example.com',
    password: 'password',
    verified: true,
    role: auth.roles[1] || auth.roles[0],
    token: getFakeJwtToken(1),
    bio: 'I\'m a strong man. i work as a fitness trainer. I can help you moving.',
    image: '',
    city: 'Hamburg',
    country: 'Germany',
    profession: 'Fitness Trainer',
    disclose_location: true,
    latitude: '55.0',
    longitude: '10',
  },
  {
    id: 3,
    first_name: 'Charlie',
    last_name: 'Userman',
    email: 'charlie@example.com',
    password: 'abc123',
    verified: false,
    role: auth.roles[1] || auth.roles[0],
    token: getFakeJwtToken(2),
    bio: `Hey ho! I am charlie and electrician. if you need someone to fix
    your light bulb... Call me! i can also put new cables in your walls because i have big tools.`,
    image: '',
    city: 'Hamburg',
    country: 'Germany',
    profession: 'Electrician',
    disclose_location: false,
    latitude: '60',
    longitude: '0',
  },
];

const getStoredUsers = () => {
  const serialised_users = localStorage.getItem('users');
  if (serialised_users) {
    return JSON.parse(serialised_users);
  } else {
    return [];
  }
};

const shouldUpdateLocalStorage = () => {
  const storedUsers = getStoredUsers();

  if (storedUsers.length < 1) {
    return true;
  }

  const schema = fakeUsers[0];
  const storedUser = storedUsers[0];

  if (Object.keys(schema).length !== Object.keys(storedUser).length) {
    return true;
  }

  return false;
};

if (shouldUpdateLocalStorage()) {
  localStorage.setItem('users', JSON.stringify(fakeUsers));
}

export const handleRegistration = (request) => {
  const email: string = request.body.email;
  const password: string = request.body.password;
  const users: any[] = getStoredUsers();
  if (users.some((user) => user.email === email)) {
    throw {
      email: ['A user has already been registered with this email address.'],
    };
  }
  // save new user
  users.push({
    email,
    password,
    verified: true, // omit the verification step because it is hard to mock
    role: auth.roles[0],
    token: getFakeJwtToken(users.length),
  });
  localStorage.setItem('users', JSON.stringify(users));
  return { detail: 'Verification e-mail sent.' };
};

export const handleLogin = (request) => {
  const email: string = request.body.email;
  const password: string = request.body.password;
  const users: any[] = getStoredUsers();
  for (const user of users) {
    if (user.email === email) {
      if (user.verified) {
        if (user.password === password) {
          // both email and password match
          const currentUser = {
            token: user.token,
          };
          return currentUser;
        } else {
          // account exists but password is wrong
          throw {
            non_field_errors: ['Unable to log in with provided credentials.'],
          };
        }
      } else {
        // account not activated (email not verified)
        throw {
          non_field_errors: ['E-mail is not verified.'],
        };
      }
    }
  }
  // account not exists
  throw {
    non_field_errors: ['Unable to log in with provided credentials.'],
  };
};

export const handleGetUserInfo = (req) => {
  const reqToken = req.headers.get('Authorization').replace('JWT ', '');
  return {
    user: getStoredUsers().find((user) => user.token === reqToken),
  };
};

export const handleGetUserDetails = (req) => {
  console.log('User request', req);
  const user = fakeUsers[0];
  return {
    id: user.id,
    bio: user.bio,
    image: user.image,
    first_name: user.first_name,
    last_name: user.last_name,
    city: user.city,
    country: user.country,
    profession: user.profession,
  };
};

export const handleGetUserListByLocation = (req) => {
  const params = req.params.map;
  const northEast = {
    lat: params.get('latNE')[0],
    lng: params.get('lngNE')[0],
  };
  const southWest = {
    lat: params.get('latSW')[0],
    lng: params.get('lngSW')[0],
  };

  return fakeUsers.filter((service) => {
    const point = {
      lat: Number(service.latitude),
      lng: Number(service.longitude),
    };
    return isInsideBounds(point, northEast, southWest);
  });
};
