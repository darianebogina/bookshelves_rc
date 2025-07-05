// https://www.googleapis.com/books/v1/volumes?q=java&filter=ebook
let query = "javascript";
let filter = "ebooks";
const maxResults = 15;
let startIndex = 0;
const url = "https://www.googleapis.com/books/v1/volumes?q={query}&filter={filter}&maxResults={maxResults}&startIndex={startIndex}";

const content = document.getElementsByClassName("books__cards")[0];
const input = document.getElementsByClassName('input')[0];
const button = document.getElementsByClassName('search__button')[0];
const select = document.getElementsByClassName('filter__books')[0];

async function getBooks() {
    let currentUrl = url.replace('{query}', query)
        .replace('{filter}', filter)
        .replace('{maxResults}', maxResults)
        .replace('{startIndex}', startIndex);
    console.log(currentUrl);

    let response = await fetch(currentUrl);
    let result = await response.json();
    console.log(result);
    if (result.totalItems == 0) {
        alert("No books found");
        return;
    }
    let items = result.items;
    let arrayOfObj = [];

    for (let i = 0; i < items.length; i += 1) {
        let info = items[i].volumeInfo;
        let imgDefault = "https://placeholdit.com/290x230/dddddd/999999?text=no+photo";
        let titleDefault = "No title";
        let authorDefault = "Unknown";
        let descriptionDefault = "";
        arrayOfObj.push({
            img: info.imageLinks?.thumbnail
                && info.imageLinks?.smallThumbnail
                || imgDefault,
            title: info.title || titleDefault,
            author: info.authors ? info.authors.join(", ") : authorDefault,
            description: info.description || descriptionDefault,
        });
    }
    console.log(arrayOfObj);
    return arrayOfObj;
}

function createCard(arrayOfObj) {
    if (arrayOfObj == undefined) {
        return;
    }
    for (let i = 0; i < arrayOfObj.length; i += 1) {
        let book = document.createElement("div");
        book.classList.add("book");

        let image = document.createElement("img");
        image.src = arrayOfObj[i].img;
        image.alt = "book_img";
        book.appendChild(image);

        let container = document.createElement("div");
        container.classList.add("book__content");
        book.appendChild(container);

        let title = document.createElement("h4");
        title.classList.add("book__title");
        title.textContent = arrayOfObj[i].title;
        container.appendChild(title);

        let author = document.createElement("h5");
        author.classList.add("book__author");
        author.textContent = arrayOfObj[i].author;
        container.appendChild(author);

        let description = document.createElement("p");
        description.classList.add("book__description");
        description.textContent = arrayOfObj[i].description;
        container.appendChild(description);

        content.appendChild(book);
    }
}

function queryBooks() {
    if (input.value == "") {
        alert("Please input book name");
    }
    startIndex = 0;
    query = input.value;
    filter = select.value;

    getBooks().then(data => {
        content.innerHTML = "";
        createCard(data);
    });
}

function clearInput() {
    input.value = "";
}

function scrollInfinity() {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 700) {
        throttledUpdate();
    }
}

function throttle(func, delay) {
    let timerFlag = 0;

    return (...args) => {
        if (timerFlag === 0) {
            func(...args);
            timerFlag = setTimeout(() => {
                timerFlag = 0;
            }, delay);
        }
    };
}

throttledUpdate = throttle(() => {
    startIndex += maxResults;
    getBooks().then(data => createCard(data));
}, 900);

window.addEventListener('scroll', scrollInfinity);

getBooks().then(data => createCard(data));
