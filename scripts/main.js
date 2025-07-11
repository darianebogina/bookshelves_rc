import { createCard } from './card.js';
// https://www.googleapis.com/books/v1/volumes?q=java&filter=ebook
let query = "javascript";
let filter = "ebooks";
const maxResults = 15;
let startIndex = 0;
const url = "https://www.googleapis.com/books/v1/volumes?q={query}&filter={filter}&maxResults={maxResults}&startIndex={startIndex}";

const content = document.getElementsByClassName("books__cards")[0];
const input = document.getElementsByClassName('input')[0];
const select = document.getElementsByClassName('filter__books')[0];

async function getBooks() {
    let currentUrl = url.replace('{query}', query)
        .replace('{filter}', filter)
        .replace('{maxResults}', maxResults)
        .replace('{startIndex}', startIndex);
    console.log(currentUrl);

    let response = await fetch(currentUrl);
    let result = await response.json();
    return result;
}

function createBookObjects(result) {
    if (result.totalItems == 0) {
        alert("No books found");
        return;
    }
    let items = result.items;
    let arrayOfObj = [];
    console.log(items);
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
            bookID: items[i].id,
        });
    }
    console.log(arrayOfObj);
    return arrayOfObj;
}

function queryBooks() {
    if (input.value == "") {
        alert("Please input book name");
    }
    startIndex = 0;
    query = input.value;
    filter = select.value;
    getBooks().then(result => {
        content.innerHTML = "";
        createCard(createBookObjects(result));
    });
}

function scrollInfinity() {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 700) {
        startIndex += maxResults;
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

const throttledUpdate = throttle(() =>
    getBooks().then(result => createCard(createBookObjects(result)))
    , 900);

window.addEventListener('scroll', scrollInfinity);

getBooks().then(result => createCard(createBookObjects(result)));
