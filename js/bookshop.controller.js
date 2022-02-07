'use strict'

function onInit() {
   
    renderBooks()
}

function renderBooks() {
    var books = getBooks()
    var strHTMLs = books.map(function (book) {
        return `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>$${book.price}</td>
            <td><button class="btn-read btn" onclick="onReadBook(${book.id})">Read</button></td>
            <td><button class="btn-update btn" onclick="onDisplayUpdatePrice(${book.id})">Update</button></td>
            <td><button class="btn-delete btn" onclick="onRemoveBook(${book.id})")>Delete</button></td>
          </tr>
        `
    })
    document.querySelector('.book-list').innerHTML = strHTMLs.join('');
    document.querySelector('.error-msg').style.display = 'none';
    // document.querySelector('.inputs-container').style.display = 'none';
}

function onAddBook() {
    var title = document.querySelector('#title').value
    var price = +document.querySelector('#price').value
    if (!title || !price || price < 0) {
        document.querySelector('.error-msg').style.display = "block";
        setTimeout(() => {
            document.querySelector('.error-msg').style.display = 'none';
        }, 3000);
        return;
    }
    else {
        const book = addBook(title, price)
        document.querySelector('#title').value = ''
        document.querySelector('#price').value = ''
        renderBooks()
        flashMsg(`Book Added (id: ${book.id})`)
    }
    return;
}

function displayInput() {
    document.querySelector('.inputs-container').style.display = 'inline-block';
    document.querySelector('#title').style.display = 'inline-block';
    document.querySelector('#price').style.display = 'inline-block';
    document.querySelector('.new-book').style.display = 'inline-block';
    document.querySelector('.update-book').style.display = 'none';
}

function onCloseCreateInputs() {
    document.querySelector('#title').value = ''
    document.querySelector('#price').value = ''
    document.querySelector('.inputs-container').style.display = 'none';

}

function onRemoveBook(bookId) {
    var res = confirm('Are you sure you want to delete this book?')
    if (!res) return
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Removed (id: ${bookId})`)
}

function onDisplayUpdatePrice(bookId) {
    document.querySelector('.book-id-hidden').innerText = bookId
    document.querySelector('.inputs-container').style.display = 'inline-block';
    document.querySelector('#title').style.display = 'none';
    document.querySelector('.new-book').style.display = 'none';
    document.querySelector('.update-book').style.display = 'inline-block';
    var price = getBookById(bookId).price
    document.querySelector('#price').value = price
}

function onUpdateBook() {
    var bookId = +(document.querySelector('.book-id-hidden').innerText)
    var newPrice = +document.querySelector('#price').value
    if (!newPrice || newPrice <= 0) {
        document.querySelector('.error-msg').style.display = "block";
        setTimeout(() => {
            document.querySelector('.error-msg').style.display = 'none';
        }, 3000);
        return;
    }
    else if (newPrice) {
        const book = updateBook(bookId, newPrice)
        document.querySelector('#price').value = ''
        onCloseCreateInputs()
        renderBooks();
        var elModal = document.querySelector('.modal')
        if (elModal.display !== 'none') {
            elModal.querySelector('h4 span').innerText = book.price
        }
        flashMsg(`Updated price to ${newPrice}`)
        return;
    }
}

function onChangeRate(action) {
    console.log(action)
    var elQty = document.querySelector('.rate-container span');
    if (action === 'minus' && elQty.innerText > 0) elQty.innerText--;
    else if (action === 'plus' && elQty.innerText < 10) elQty.innerText++;
    var bookId = +(document.querySelector('.book-id-hidden').innerText)
    var bookRate = +elQty.innerText;
    updateRate(bookId, bookRate);
    renderBooks()
}

function onReadBook(bookId) {
    const book = getBookById(bookId);
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.title
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('.book-desc').innerText = book.desc
    elModal.querySelector('.rate-container span').innerText = book.rate + ''
    elModal.querySelector('.book-id-hidden').innerText = book.id
    elModal.querySelector('.book-cover').setAttribute('src', `img/${book.img}`)
    elModal.classList.add('open')
    return book;
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onSetSortBy(sortBy = {}) {
    if (!gSortBy[sortBy]) {
        gSortBy = {
            [sortBy]: 1
        }
    }
    else {
        gSortBy[sortBy] *= -1
    }
    //will create: { price: 1} or {title:1}
    setBookSort(sortBy)
    renderBooks()
}


function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onNextPage(pageNum = gPageIdx) {
    setNextPage(pageNum)
    setPrevNextButtons()
    renderBooks()
}

function onPrevPage() {
    setPrevPage()
    setPrevNextButtons()
    renderBooks()
}

function setPrevNextButtons(){
    var elPrev = document.querySelector('.prev')
    var elNext = document.querySelector('.next')
    elNext.disabled = ((gPageIdx+1) * PAGE_SIZE >= gBooks.length) ? true : false
    elPrev.disabled = (gPageIdx === 0) ? true : false
    if(elNext.disabled) elNext.classList.add('disabled')
    else if(!elNext.disabled) elNext.classList.remove('disabled')
    if(elPrev.disabled) elPrev.classList.add('disabled')
    else if(!elPrev.disabled) elPrev.classList.remove('disabled')
}