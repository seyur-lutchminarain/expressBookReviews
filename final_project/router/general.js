const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book list async
async function getBooks() {
  try {
    const response = await axios.get("http://localhost:8000/");
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Async get books based on ISBN
async function getBooksByIsbn(isbn) {
  try {
    const response = await axios.get(`http://localhost:8000/isbn/${isbn}`);
    return response.data;
  } catch (err) {
    throw error;
  }
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = [];
  for (var i = 1; i <= 10; i++) {
    if (books[i].author === author) {
      booksByAuthor.push(books[i]);
    }
  }

  res.status(200).json({ booksByAuthor: booksByAuthor });
});

//Get books by author async
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:8000/author/${author}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = [];
  for (var i = 1; i <= 10; i++) {
    if (books[i].title === title) {
      booksByTitle.push(books[i]);
    }
  }
  res.status(200).json({ booksByTitle: booksByTitle });
});

// Get books by title async
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:8000/title/${title}`);
    return response.data;
  } catch (err) {
    throw err;
  }
}

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);

  books[isbn]
    ? res.send(books[isbn].reviews)
    : res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
module.exports.getBooks = getBooks;
module.exports.getBooksByIsbn = getBooksByIsbn;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
