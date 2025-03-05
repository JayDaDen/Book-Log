let books = [];

function addBook() {
    const title = document.getElementById("bookTitle").value;
    const genre = document.getElementById("bookGenre").value;
    const author = document.getElementById("bookAuthor").value;

    if (title && genre && author) {
        const book = { title, genre, author, status: "To Read", rating: 0 };
        books.push(book);
        displayBooks();
    }
}
