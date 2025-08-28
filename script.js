// const booksContainer = document.querySelector(".container");
// const formElement = document.querySelector("form");
// const inputs = formElement.querySelectorAll("input");
// const addButton = document.querySelector("[data-open-modal]");
// const submitButton = document.querySelector(".submit");
// const cancelButton = document.querySelector(".cancel");
// const modal = document.querySelector("[data-modal]");

// let library = [
//     new Book("Death Note", "Tsugumi Ohba", 2400, false),
// ];

// function Book(title, author, pages, read) {
//     if (!new.target) {
//         throw Error("Use the new operator to create a new object.");
//     };
//     this.id = crypto.randomUUID();
//     this.title = title;
//     this.author = author;
//     this.pages = pages;
//     this.read = read;
// }

// Book.prototype.toggleReadStatus = function(button) {
//     this.read = !this.read;
//     button.classList.toggle("read");
//     button.textContent = (this.read) ? "Read" : "Not Read";
// }

// function addBookToLibrary(event) {
//     if (formElement.checkValidity()) {
//         event.preventDefault();
//         const formData = new FormData(formElement);
//         const book = new Book(
//             formData.get('title'), 
//             formData.get("author"), 
//             formData.get("pages"), 
//             formData.get("read")
//         );
//         library.push(book);
//         closeModal();
//         displayBooks();
//     }
// }

// function removeBookFromLibrary(event) {
//     if (event.target.classList.contains("remove")) {
//         const id = event.target.dataset.id;
//         library = library.filter(book => book.id !== id);
//         displayBooks();
//     }
// }

// function displayBooks() {
//     booksContainer.innerHTML = '';
//     library.forEach((book) => {
//         const bookCard = document.createElement("div");
//         bookCard.classList.add("book-card");

//         bookCard.innerHTML = 
//             `
//                 <div class='card-banner'></div>
//                 <div class='book-info'>
//                     <h2>${book.title}</h2>
//                     <div class="sub-info">
//                         <h3>${book.author}</h3>
//                         <h4>${book.pages} pages</h4>
//                     </div>
//                     <div class='card-buttons'>
//                         <button class='toggle ${book.read ? 'read' : ''}' data-id=${book.id}>${book.read ? 'Read' : 'Not Read'}</button>
//                         <button class='remove' data-id=${book.id}>Remove</button>
//                     </div>
//                 </div>
//             `;
//         booksContainer.append(bookCard);
//     });
// }

// function closeModal() {
//     modal.classList.remove("open");
//     formElement.reset();
//     setTimeout(() => {
//         modal.close();
//     }, 200);
// }

// addButton.addEventListener("click", () => {
//     modal.showModal();
//     modal.classList.add("open");
// });
// cancelButton.addEventListener("click", closeModal);
// modal.addEventListener("cancel", (event) => {
//     // prevent the default action of escape key which removes transitions
//     event.preventDefault();
//     closeModal();
// });

// formElement.addEventListener("submit", addBookToLibrary);
// booksContainer.addEventListener("click", (event) => {
//     if (event.target.classList.contains("toggle")) {
//         const book = library.find(book => book.id === event.target.dataset.id);
//         book.toggleReadStatus(event.target);
//     }
// })
// booksContainer.addEventListener("click", removeBookFromLibrary);

// displayBooks();


/**
 * contains code relevant only to a book object
 * toggleReadStatus -> like prototype (only one such method applying to all book objects)
 */
class Book {
    constructor(title, author, pages, read) {
        if (!new.target) {
            throw Error("Use the new operator to create a new object.");
        };
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleReadStatus(button){
        // this.read is required so JS knows to get this instance's read property
        // else it will try to access a nonexistent read variable in its scope
        this.read = !this.read;

    }
}

/**
 * contains code relevant only to maintaining the library/collection of books
 */
class Library {
    #books = [ ];

    constructor() {
        this.#books.push(new Book("Death Note", "Tsugumi Ohba", 2400, false));
    }

    // basic methods that are called on by the display
    // abstracts all DOM dependencies from library class
    addBook(book) {
        this.#books.push(book);
    }

    removeBook(id) {
        this.#books = this.#books.filter(book => book.id !== id);
    }

    // this.#books instead of #books
    // accesses specific private field of instance of caller
    getBooks() {
        return [...this.#books];
    }

    findBook(id) {
        return this.#books.find(book => book.id === id);
    }
}

class Display {
    // passing library class/object to be responsive in this class
    constructor(library) {
        this.library = library;

        this.booksContainer = document.querySelector(".container");
        this.formElement = document.querySelector("form");
        this.modal = document.querySelector("[data-modal]");
        this.addButton = document.querySelector("[data-open-modal]");
        this.cancelButton = document.querySelector(".cancel");

        this._setUpEventListeners();
    }

    _setUpEventListeners() {
        this.addButton.addEventListener("click", () => {
            this.modal.showModal();
            this.modal.classList.add("open");
        });
        
        // allows for button and esc key
        // this.closeModal() ensures "this" refers to Display instance, not the 
        // cancelButton (which "this" would otherwise refer to)
        this.cancelButton.addEventListener("click", () => this.closeModal());
        this.modal.addEventListener("cancel", (event) => {
            event.preventDefault();
            this.closeModal();
        });

        this.formElement.addEventListener("submit", (event) => {
            if (this.formElement.checkValidity()) {
                event.preventDefault();
                const formData = new FormData(this.formElement);
                const book = new Book(
                    formData.get('title'), 
                    formData.get("author"), 
                    formData.get("pages"), 
                    formData.get("read")
                );
                this.library.addBook(book);
                this.closeModal();
                this.render();
            }
        });

        this.booksContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("toggle")) {
                const book = this.library.findBook(event.target.dataset.id);
                book.toggleReadStatus(event.target);
                event.target.textContent = (book.read) ? "Read" : "Not Read";
                event.target.classList.toggle("read");
            }
            if (event.target.classList.contains("remove")) {
                this.library.removeBook(event.target.dataset.id);
                this.render();
            }
        });
    }
    
    render() {
        this.booksContainer.innerHTML = '';
        this.library.getBooks().forEach((book) => {
            const card = document.createElement("div");
            card.classList.add("book-card");

            card.innerHTML = `
                <div class='card-banner'></div>
                <div class='book-info'>
                    <h2>${book.title}</h2>
                    <div class="sub-info">
                        <h3>${book.author}</h3>
                        <h4>${book.pages} pages</h4>
                    </div>
                    <div class='card-buttons'>
                        <button class='toggle ${book.read ? 'read' : ''}' data-id=${book.id}>
                            ${book.read ? 'Read' : 'Not Read'}
                        </button>
                        <button class='remove' data-id=${book.id}>Remove</button>
                    </div>
                </div>
            `;
            this.booksContainer.append(card);
        });
    }

    closeModal() {
        this.modal.classList.remove("open");
        this.formElement.reset();
        setTimeout(() => this.modal.close(), 200);
    }
}

const library = new Library();
const display = new Display(library);

display.render();
