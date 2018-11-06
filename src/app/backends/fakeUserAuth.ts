import { auth } from '../constants';

const getFakeJwtToken = (i) => `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58${i}`;

const fakeUsers = [
  {
    email: 'alice@example.com',
    password: '123456',
    verified: true,
    role: auth.roles[0],
    token: getFakeJwtToken(0),
  },
  {
    email: 'bob@example.com',
    password: 'password',
    verified: true,
    role: auth.roles[1],
    token: getFakeJwtToken(1),
  },
  {
    email: 'charlie@example.com',
    password: 'abc123',
    verified: false,
    role: auth.roles[1],
    token: getFakeJwtToken(2),
  },
];

if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(fakeUsers));
}

const getStoredUsers = () => {
  const serialised_users = localStorage.getItem('users');
  if (serialised_users) {
    return JSON.parse(serialised_users);
  } else {
    return [];
  }
};

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
    role: auth.roles[1],
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
  return getStoredUsers().find((user) => user.token === reqToken);
};
