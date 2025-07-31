const library = [
    {
        id: crypto.randomUUID(),
        title: "testTitle",
        author: "testAuthor",
        pages: 100,
        read: false
    }
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

function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    library.push(book);
}

// addBookToLibrary("naruto", "kishimoto", 9000, true);
// console.log(library[1].title);
// console.log(library[0].id);
// console.log(library[1].id);

