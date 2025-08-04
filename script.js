const booksContainer = document.querySelector(".container");
const formElement = document.querySelector("form");
const addButton = document.querySelector("[data-open-modal]");
const submitButton = document.querySelector(".submit");
const cancelButton = document.querySelector(".cancel");
const modal = document.querySelector("[data-modal]");
const library = [];

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
        console.log(book.title);
        library.push(book);
        closeModal();
        displayBooks();
    }
}

function displayBooks() {
    library.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("book-card");

        bookCard.innerHTML = 
            `
                <div class='card-banner'></div>
                <div class='book-info'>
                    <h2>${book.title}</h2>
                    <h3>${book.author}</h3>
                    <h3>${book.pages}</h3>
                    <div class='card-buttons'>
                        <button class='${book.read}'>Read</button>
                        <button class='remove'>Remove</button>
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

formElement.addEventListener("submit", addBookToLibrary);

cancelButton.addEventListener("click", closeModal);

modal.addEventListener("cancel", (event) => {
    // prevent the default action of escape key which removes transitions
    event.preventDefault();
    closeModal();
});

displayBooks();

