const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const users = [
  { id: 1, username: 'pedro', password: 'pedro1234' },
  { id: 2, username: 'estefany', password: 'estefany123' },
];

const secretKey = 'dup9!@#%^&*()zrjzgf7bzqytmb5rf662zka2eh';

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).send('Invalid credentials!!!');
  }

  const token = jwt.sign({ userId: user.id }, secretKey);

  res.send({ token });
});

app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('No Header');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secretKey, (err, payload) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    res.send({ message: 'This is protected data', userId: payload.userId });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
