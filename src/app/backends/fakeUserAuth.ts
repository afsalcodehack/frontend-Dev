import { auth } from '../constants';

const getFakeJwtToken = (i) => `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58${i}`;

const fakeUsers = [
  {
    first_name: 'Alice',
    last_name: 'Userman',
    email: 'alice@example.com',
    password: '123456',
    verified: true,
    role: auth.roles[0],
    token: getFakeJwtToken(0),
  },
  {
    first_name: 'Bob',
    last_name: 'Userman',
    email: 'bob@example.com',
    password: 'password',
    verified: true,
    role: auth.roles[1] || auth.roles[0],
    token: getFakeJwtToken(1),
  },
  {
    first_name: 'Charlie',
    last_name: 'Userman',
    email: 'charlie@example.com',
    password: 'abc123',
    verified: false,
    role: auth.roles[1] || auth.roles[0],
    token: getFakeJwtToken(2),
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
