const booksContainer = document.querySelector(".container");
const formElement = document.querySelector("form");
const inputs = formElement.querySelectorAll("input");
const addButton = document.querySelector("[data-open-modal]");
const submitButton = document.querySelector(".submit");
const cancelButton = document.querySelector(".cancel");
const modal = document.querySelector("[data-modal]");

let library = [
    new Book("Death Note", "Tsugumi Ohba", 2400, false),
];

function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("Use the new operator to create a new object.");
    };
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleReadStatus = function(button) {
    this.read = !this.read;
    button.classList.toggle("read");
    button.textContent = (this.read) ? "Read" : "Not Read";
}

function addBookToLibrary(event) {
    if (formElement.checkValidity()) {
        event.preventDefault();
        const formData = new FormData(formElement);
        const book = new Book(
            formData.get('title'), 
            formData.get("author"), 
            formData.get("pages"), 
            formData.get("read")
        );
        library.push(book);
        closeModal();
        displayBooks();
    }
}

function removeBookFromLibrary(event) {
    if (event.target.classList.contains("remove")) {
        const id = event.target.dataset.id;
        library = library.filter(book => book.id !== id);
        displayBooks();
    }
}

function displayBooks() {
    booksContainer.innerHTML = '';
    library.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = 
            `
                <div class='card-banner'></div>
                <div class='book-info'>
                    <h2>${book.title}</h2>
                    <div class="sub-info">
                        <h3>${book.author}</h3>
                        <h4>${book.pages} pages</h4>
                    </div>
                    <div class='card-buttons'>
                        <button class='toggle ${book.read ? 'read' : ''}' data-id=${book.id}>${book.read ? 'Read' : 'Not Read'}</button>
                        <button class='remove' data-id=${book.id}>Remove</button>
                    </div>
                </div>
            `;
        booksContainer.append(bookCard);
    });
}

function closeModal() {
    modal.classList.remove("open");
    formElement.reset();
    setTimeout(() => {
        modal.close();
    }, 200);
}

addButton.addEventListener("click", () => {
    modal.showModal();
    modal.classList.add("open");
});
cancelButton.addEventListener("click", closeModal);
modal.addEventListener("cancel", (event) => {
    // prevent the default action of escape key which removes transitions
    event.preventDefault();
    closeModal();
});

formElement.addEventListener("submit", addBookToLibrary);
booksContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("toggle")) {
        const book = library.find(book => book.id === event.target.dataset.id);
        book.toggleReadStatus(event.target);
    }
})
booksContainer.addEventListener("click", removeBookFromLibrary);

displayBooks();