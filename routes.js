const express = require('express');
const router = express.Router();
const dataManager = require('./dataManager');

/**
 * Method to wrap the try catch code to reduce repetative code
 * @param {function} cb 
 */
function asyncHandler(cb){
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err){
            next(err);
        }
    }
}

// send a GET request to get a list of books
router.get('/books', asyncHandler(async (req, res) =>{
    const books = await dataManager.getBooks();
    res.json(books);
}));

// send a GET request to get a book by id
router.get('/book/:id', asyncHandler(async (req, res) => {
    const book = await dataManager.getBook(req.params.id);
    if(book){
        res.json(book);
    }else {
        res.status(400).json({message: "Book id is not valid."});
    }
}));

// send a POST request to /book to create a new book
router.post('/book', asyncHandler(async (req, res) =>{
    if(req.body.name && req.body.author && req.body.genere){
        const book = await dataManager.createBook({
            name : req.body.name,
            author: req.body.author,
            genere : req.body.genere
        });
        res.status(201).json(book);
    } else {
        res.status(400).json({message: "Please fill in all required fields. Name, author and genere are required."});
    }
}));

// send a PUT request to /book/:id to update a book record 
router.put('/book/:id', asyncHandler(async(req, res)=> {
    const book = await dataManager.getBook(req.params.id);
    if (book){
        book.name = req.body.name;
        book.author = req.body.author;
        book.genere = req.body.genere;
        await dataManager.updateBook(book);
        res.status(204).end();
    } else {
        res.status(400).json({message: "Invalid ID, book with specified id not found."});
    }
}));

// send a DELETE request to delete /book/:id record 
router.delete('/book/:id', asyncHandler(async(req,res,next)=>{
    const book = await dataManager.getBook(req.params.id);
    await dataManager.deleteBook(book);
    res.status(204).end();
}));

module.exports = router;