let readingLog = [];
let books = [];

function searchGoogleBooks() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(response => response.json())
        .then(data => {
            books = (data.items || []).map(item => ({
                title: item.volumeInfo.title || "Unknown Title",
                genre: item.volumeInfo.categories ? item.volumeInfo.categories.join(', ') : "Unknown Genre",
                image: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150',
                status: '',
                rating: item.volumeInfo.averageRating || 'Not Rated',
                addedToLog: readingLog.some(b => b.title === item.volumeInfo.title)
            }));

            renderBooks();
        })
        .catch(error => console.error('Error fetching books:', error));
}

function renderBooks() {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach((book, index) => {
        const bookItem = document.createElement('li');
        bookItem.className = 'list-group-item book-card';
        bookItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <img src="${book.image}" class="img-thumbnail" style="width: 60px; height: 90px; margin-right: 10px;">
                    <div>
                        <strong>${book.title}</strong><br>
                        <small>${book.genre}</small><br>
                        <select class="form-select form-select-sm mt-2" onchange="updateBookStatus(this, ${index})">
                            <option value="">Select Status</option>
                            <option value="to-read">To Read</option>
                            <option value="reading">In the Middle of Reading</option>
                            <option value="completed">Completed</option>
                        </select>
                        <strong>Rating:</strong> ${book.rating} / 5
                    </div>
                </div>
                <button id="addToLogBtn-${index}" class="btn btn-success btn-sm" onclick="addToLog(${index})" ${book.addedToLog ? "disabled" : ""}>
                    ${book.addedToLog ? "Book Added" : "Add to Log"}
                </button>
            </div>
        `;
        bookList.appendChild(bookItem);
    });
}

function updateBookStatus(selectElement, index) {
    const selectedStatus = selectElement.value;
    books[index].status = selectedStatus;
    if (selectedStatus === "completed") {
        showCelebration();
    }
}

function addToLog(index) {
    const book = books[index];
    if (!readingLog.some(b => b.title === book.title)) {
        readingLog.push(book);
    }
    document.getElementById(`addToLogBtn-${index}`).textContent = "Book Added";
    document.getElementById(`addToLogBtn-${index}`).classList.replace("btn-success", "btn-secondary");
    document.getElementById(`addToLogBtn-${index}`).disabled = true;
    renderLog();
}

function renderLog() {
    const logList = document.getElementById('logList');
    if (!logList) return;

    logList.innerHTML = '';
    document.getElementById('logMessage').style.display = readingLog.length === 0 ? 'block' : 'none';

    readingLog.forEach((book, index) => {
        const logItem = document.createElement('li');
        logItem.className = 'list-group-item book-card';
        logItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <img src="${book.image}" class="img-thumbnail" style="width: 60px; height: 90px; margin-right: 10px;">
                    <div>
                        <strong>${book.title}</strong><br>
                        <small>${book.genre}</small><br>
                        <select class="form-select form-select-sm mt-2" onchange="updateLogBookStatus(this, ${index})">
                            <option value="to-read" ${book.status === "to-read" ? "selected" : ""}>To Read</option>
                            <option value="reading" ${book.status === "reading" ? "selected" : ""}>In the Middle of Reading</option>
                            <option value="completed" ${book.status === "completed" ? "selected" : ""}>Completed</option>
                        </select>
                        <strong>Rating:</strong> <span id="bookRating-${index}">${book.rating}</span> / 5
                    </div>
                </div>
                <div>
                    <input type="number" id="ratingInput-${index}" min="1" max="5" class="form-control-sm mt-2" placeholder="Rate 1-5">
                    <button class="btn btn-info btn-sm mt-2" onclick="updateRating(${index})">Submit Rating</button>
                    <button class="btn btn-danger btn-sm mt-2" onclick="confirmDelete(${index})">Delete</button>
                </div>
            </div>
        `;
        logList.appendChild(logItem);
    });
}

function updateLogBookStatus(selectElement, index) {
    const selectedStatus = selectElement.value;
    readingLog[index].status = selectedStatus;
    if (selectedStatus === "completed") {
        showCelebration();
    }
    renderLog();
}

function updateRating(index) {
    const ratingInput = document.getElementById(`ratingInput-${index}`).value;
    if (ratingInput >= 1 && ratingInput <= 5) {
        readingLog[index].rating = ratingInput;
        document.getElementById(`bookRating-${index}`).textContent = ratingInput;
    } else {
        alert("Please enter a rating between 1 and 5.");
    }
}

function confirmDelete(index) {
    if (confirm("Are you sure you want to delete this book from your log?")) {
        readingLog.splice(index, 1);
        renderLog();
    }
}

function showCelebration() {
    const celebrationDiv = document.getElementById('celebrationMessage');
    celebrationDiv.style.display = 'block';
    celebrationDiv.style.opacity = '1';
    celebrationDiv.classList.add('show');
    setTimeout(() => {
        celebrationDiv.classList.remove('show');
        setTimeout(() => {
            celebrationDiv.style.display = 'none';
        }, 500);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
    renderLog();
});

