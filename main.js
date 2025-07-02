// https://www.googleapis.com/books/v1/volumes?q={search terms}
const url = "https://www.googleapis.com/books/v1/volumes?q=";
let query = "javascript";
const endUrl = "";

let content = document.getElementsByClassName("books__cards")[0];

async function getBooks() {
    let response = await fetch(url + query + endUrl);
    let result = await response.json();
    let items = result.items;
    console.log(items);
    let arrayOfObj = [];
    for (let i = 0; i < items.length; i += 1) {
        arrayOfObj.push({
            img: items[i].volumeInfo.imageLinks.smallThumbnail,
            title: items[i].volumeInfo.title,
            author: items[i].volumeInfo.authors.join(", "),
            description: items[i].volumeInfo.description,
        });
    }
   return arrayOfObj;
}

function createCard(arrayOfObj) {

}

let books = getBooks();
createCard(books);
