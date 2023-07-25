const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const readBooks = () => {
  const booksData = fs.readFileSync('books.json');
  return JSON.parse(booksData);
};

const writeBooks = (books) => {
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
};

app.get('',(req,res) =>{
  res.send('Build a directory of books')
})

app.get('/books', (req, res) => {
  const books = readBooks();
  res.json(books);
});

app.post('/books', (req, res) => {
  const books = readBooks();
  const newBook = req.body;
  books.push(newBook);
  writeBooks(books);
  res.json(newBook);
});

app.put('/books/:id', (req, res) => {
  const books = readBooks();
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = { ...books[index], ...updatedBook };
    writeBooks(books);
    res.json(books[index]);
  } else {
    res.status(404).send('Book not found');
  }
});

app.delete('/books/:id', (req, res) => {
  const books = readBooks();
  const bookId = parseInt(req.params.id);
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    const deletedBook = books.splice(index, 1);
    writeBooks(books);
    res.json(deletedBook[0]);
  } else {
    res.status(404).send('Book not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
