const fs = require('fs');

/**
 * Method to retrieve all books 
 * @param None
 */
function getBooks() {
    return new Promise( (resolve, reject) => {
        fs.readFile('library.json', 'utf8', (err, data) =>{
            if(err){
                reject(err);
            } else {
                const json = JSON.parse(data);
                resolve(json);
            }
        });
    });
}
/**
 * Method to return book by the specified id
 * @param {number} id, id of the book to retreive
 */
async function getBook(id) {
    const books = await getBooks();
    return books.find(book => book.id == id);
}
/**
 * Function to create a new book and add it to the book list
 * @param {object} newBook , object containing all required information for the book 
 */
async function createBook(newBook){
    const books = await getBooks();
    newBook.id = await generateId();
    books.push(newBook);
    await saveBooks(books);
    return newBook;
}
/**
 * Method that saves new array of books into the json file 
 * @param {object} data, array of books to write to the json
 */
function saveBooks(data){
    return new Promise( (resolve, reject) =>{
        fs.writeFile('library.json', JSON.stringify(data, null, 2), (err)=>{
            if(err){
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
/**
 * Method to update book record
 * @param {object} bookToUpdate, object containing book object with data to be updated
 */
async function updateBook(bookToUpdate){
    const books = await getBooks();
    let book = books.find(book => book.id == bookToUpdate.id);
    book.name = bookToUpdate.name;
    book.author = bookToUpdate.author;
    book.genere = bookToUpdate.genere;

    await saveBooks(books);
}
/**
 * Method to delete a book record 
 * @param {object} bookToDelete, book object representing the book that needs to be deleted 
 */
async function deleteBook(bookToDelete){
    let books = await getBooks();
    books = books.filter(book => book.id != bookToDelete.id);
    await saveBooks(books);
}
/**
 * Function to generate id for the next book
 * function returns last id (max num) from the list of books + 1
 * If there are no books in the json, it returns 1000 as the starting id
 * @param None 
 */
async function generateId(){
    const books = await getBooks();
    if(books.length) {
        return  Math.max.apply(Math, books.map(o => o.id)) + 1;
    }
    return 1000;
}

module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
}
