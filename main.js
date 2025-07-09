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

        let bookContent = document.createElement("div");
        bookContent.classList.add("content");
        book.appendChild(bookContent);

        let star = document.createElement("button");
        star.classList.add("book__fav");
        star.innerHTML = `<svg id="star" width="30px" height="30px" viewBox="0 0 24 24" fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
        stroke="#1C274C" stroke-width="1.5" />
        </svg>`;
        bookContent.appendChild(star);

        let container = document.createElement("div");
        container.classList.add("book__info");
        bookContent.appendChild(container);

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

        book.addEventListener('click', function (e) {
            if (e.target.closest('book__fav')) return;

            window.location.href = `book.html?bookID=${arrayOfObj[i].bookID}`;
        });
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
