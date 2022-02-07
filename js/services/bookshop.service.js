'use strict'

var gBooks = []
const STORAGE_KEY = 'bookDB';
const PAGE_SIZE = 5;
const gBookCovers = ['book-cover.jpg', 'book-cover2.jpg', 'book-cover3.jpg', 'book-cover4.jpg']
var gSortBy = {}
var gPageIdx = 0;

_createBooks()

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        books.push(_createBook('this is great', 80.42));
        books.push(_createBook('going in the enlightened path', 99.99));
        books.push(_createBook('hello, it\'s me', 103.12));
        books.push(_createBook('never say never no', 22.55));
        books.push(_createBook('how to become a developer', 10.23));
        books.push(_createBook('revolution of joy', 45.20));
        books.push(_createBook('going into the wild', 24.99));
        books.push(_createBook('the joy of flex', 50.99));
        books.push(_createBook('joining the coding academy', 50.99));
        books.push(_createBook('Long live the queen', 50.99));
        books.push(_createBook('The truth about pacman, chess, and balloons', 50.99));
        books.push(_createBook('Don\'t judge a book by its cover', 30.99));
        books.push(_createBook('What would be a good name for a book?', 20.99));
        books.push(_createBook('Much ado about nothing', 30.99));
        books.push(_createBook('Flexing', 10.99));
        books.push(_createBook('Going home', 13.99));
        books.push(_createBook('Just another book', 16.99));
    }
    gBooks = books;
    _saveCarsToStorage();
}


function getBooks() {
    const startIdx = gPageIdx * PAGE_SIZE
    var books = gBooks.slice(startIdx, startIdx + PAGE_SIZE)
    return books;
}

function _createBook(title=makeLorem(10),price=99.99){
    return { id: getNextId(gBooks),
        title,
        price,
        desc: makeLorem(50),
        img: gBookCovers[getRandomInt(0,4)],
        rate: 0
    }
}

function addBook(title,price) {
    const book = _createBook(title,price)
    gBooks.unshift(book)
    _saveBooksToStorage();
    return book;
}

function removeBook(bookId){
    const bookIdx = getBookIdxById(bookId)
    gBooks.splice(bookIdx,1);
    _saveBooksToStorage();
}

function updateBook(bookId, bookPrice){
    const book = getBookById(bookId)
    book.price = bookPrice;
    _saveBooksToStorage();
    return book;
}

function updateRate(bookId, bookRate){
    const book = getBookById(bookId)
    book.rate = bookRate;
    _saveBooksToStorage();
    return book;
}


function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBookIdxById(bookId){
    const bookIdx = gBooks.findIndex(book => book.id === bookId);
    return bookIdx
}

function getBookById(bookId){
    const book = gBooks.find(book => book.id === bookId);
    return book;
}

function setBookSort(sortBy) {
    if(sortBy === 'price'){
            gBooks.sort((b1, b2) => (b1.price - b2.price) * gSortBy.price)
    }
    else if (sortBy === 'title') {
        gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title) * gSortBy.title)
    }
    else if(sortBy === 'id'){
        gBooks.sort((b1, b2) => (b1.id - b2.id) * gSortBy.id)
}
    return gBooks
}

function setNextPage(pageNum = gPageIdx) {
    pageNum++
    if (pageNum * PAGE_SIZE >= gBooks.length) {
        pageNum--;
    }
    gPageIdx = pageNum
}

function setPrevPage() {
    gPageIdx--
    if (gPageIdx * PAGE_SIZE < 0) {
        gPageIdx = 0;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}