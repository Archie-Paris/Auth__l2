const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_PATH = './db.json';

app.use(bodyParser.json());
app.use(express.static('public')); // Папка для HTML и CSS файлов

// Регистрация пользователя
// Регистрация пользователя
app.post('/register', (req, res) => {
    const { login, password } = req.body;
  
    if (!login || !password) {
      return res.status(400).json({ message: 'Заполните все поля!' });
    }
  
    try {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  
      if (db.users.find(user => user.login === login)) {
        return res.status(400).json({ message: 'Пользователь уже существует!' });
      }
  
      db.users.push({ login, password, registrationTime: new Date().toISOString() });
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  
      res.json({ message: 'Регистрация успешна!' });
    } catch (error) {
      console.error('Ошибка записи в db.json:', error);
      res.status(500).json({ message: 'Ошибка сервера при регистрации.' });
    }
  });
  

// Вход пользователя
app.post('/login', (req, res) => {
  const { login, password } = req.body;

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const user = db.users.find(user => user.login === login && user.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Неверный логин или пароль!' });
  }

  res.json({ message: 'Вход выполнен успешно!' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
