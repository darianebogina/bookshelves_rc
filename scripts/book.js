const url = "https://www.googleapis.com/books/v1/volumes/{volumeId}";

async function getBook() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('bookID');
    let currentUrl = url.replace('{volumeId}', myParam);

    let response = await fetch(currentUrl);
    let result = await response.json();
    return result;
}

function fillInfo(result) {
    let info = result.volumeInfo;
    let title = document.querySelector(".book__name h2");
    title.innerHTML = info.title || "No title";

    let authors = document.querySelector(".book__name h3");
    authors.innerHTML = info.authors ? info.authors.join(", ") : "Unknown";

    let imgDefault = "https://placeholdit.com/400x500/dddddd/999999?text=No+image";
    let image = document.querySelector(".image__wrapper img");
    image.src = info.imageLinks?.thumbnail
                && info.imageLinks?.smallThumbnail
                || imgDefault;

    let description = document.getElementsByClassName("info__section")[0].children[1];
    description.innerHTML = '&emsp;' + (info.description || 'No description');

    let date = document.getElementsByClassName("info__component")[0].children[1];
    date.innerHTML = info.publishedDate || "Unknown";

    let pages = document.getElementsByClassName("info__component")[1].children[1];
    pages.innerHTML = info.pageCount || "Unknown";
}

getBook().then(data => fillInfo(data));