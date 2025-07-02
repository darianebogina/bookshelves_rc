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
        let imgDefault = "https://placeholdit.com/290x230/dddddd/999999?text=no+photo";
        let titleDefault = "No title";
        let authorDefault = "Unknown";
        let descriptionDefault = "";
        arrayOfObj.push({
            img: items[i].volumeInfo.imageLinks?.thumbnail 
                    && items[i].volumeInfo.imageLinks?.smallThumbnail
                    || imgDefault,
            title: items[i].volumeInfo.title || titleDefault,
            author: items[i].volumeInfo.authors.join(", ") || authorDefault,
            description: items[i].volumeInfo.description || descriptionDefault,
        });
        console.log(arrayOfObj[i].title);
    }
    console.log(arrayOfObj);
    return arrayOfObj;
}

function createCard(arrayOfObj) {
    content.innerHTML = "";
    for (let i = 0; i < arrayOfObj.length; i += 1) {
        let book = document.createElement("div");
        book.classList.add("book");

        let image = document.createElement("img");
        image.src = arrayOfObj[i].img;
        image.alt = "book_img";
        book.appendChild(image);

        let title = document.createElement("h4");
        title.classList.add("book__title");
        title.textContent = arrayOfObj[i].title;
        book.appendChild(title);

        let author = document.createElement("h5");
        author.classList.add("book__author");
        author.textContent = arrayOfObj[i].author;
        book.appendChild(author);

        let description = document.createElement("p");
        description.classList.add("book__description");
        description.textContent = arrayOfObj[i].description;
        book.appendChild(description);

        content.appendChild(book);
    }
}

getBooks().then(data => createCard(data));
