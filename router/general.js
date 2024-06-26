const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username=req.body.username;
  const password=req.body.password;
 if(!username||!password){
    res.status(404).json({message:"Error data"})
  }
  if(isValid(username)){
    users.push({"username":username,"password":password})
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  }
  else{
    return res.status(404).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise=new Promise((resolve,reject)=>{
    if(books){
        resolve(books)
    }
    reject({message:"cannot get data"})
  })
  .then(data=>{
    return res.status(200).json(data);
  })
  .catch(error=>{
    return res.status(400).json(error)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise=new Promise((resolve,reject)=>{
        if(books){
            resolve(books[req.params.isbn])
        }
        reject({message:"cannot get data"})
      })
      .then(data=>{
        return res.status(200).json(data);
      })
      .catch(error=>{
        return res.status(400).json(error)
      })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise=new Promise((resolve,reject)=>{
        if(books){
            let results = Object.values(books).filter(book => book.author.toLowerCase() === req.params.author.toLowerCase());
            resolve({"booksbyauthor":results})
        }
        reject({message:"cannot get data"})
      })
      .then(data=>{
        return res.status(200).json(data);
      })
      .catch(error=>{
        return res.status(400).json(error)
      })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise=new Promise((resolve,reject)=>{
        if(books){
            results=Object.values(books).filter(book=>book.title.includes(req.params.title))
            resolve({"booksbytitle":results})
        }
        reject({message:"cannot get data"})
      })
      .then(data=>{
        return res.status(200).json(data);
      })
      .catch(error=>{
        return res.status(400).json(error)
      })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.status(300).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
