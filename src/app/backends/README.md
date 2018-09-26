# Fake Backend Doc

### Authentication

When offline mode is enabled, user authentication module would use
fake data.

#### Login

There are 3 fake users hard-coded in `fakeUserAuth.ts`: `alice`, `bob` and `charlie`.
`alice` and `bob` are already activated while `charlie` hasn't passed email verification.

```javascript
{
  email: 'alice@example.com',
  password: '123456',
},
{
  email: 'bob@example.com',
  password: 'password',
},
{
  email: 'charlie@example.com',
  password: 'abc123',
}
```

To see the effect, use these accounts to login. If you use `alice` or `bob`, you will
be able to login. If you use `charlie`, the developer console would display an error
message, indicating that this account hasn't been verified, and you would not be able
to login.

#### Signup

To signup with the fake backend, just go to the signup page. You do not need to verify
your email and you would not receive a verification email anyway, because that functionality
does not exist on fake backend. Your account would be stored in you browser's local storage,
so as long as you don't clear the cache, you would be able to log in with that account.

