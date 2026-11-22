
const express = require("express");
const mongoose=require("mongoose")
const cores=require("cors");
require('dotenv').config()
const PORT =process.env.PORT || 5000


const app=express()
app.use(cores())
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(error => console.log("MongoDB Error:", error));

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    PublisherYear: {
        type: Number,
        required: [true, "Publisher Year is required"],
        min: [1000, "Publisher Year must be valid"],
        max: [new Date().getFullYear(), "Publisher Year cannot be in the future"]
    }
});
const Book = mongoose.model('Book',bookSchema)

// Implement CRUD

// create
app.post("/books", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json({
            message: "Book added successfully",
            data: newBook
        });
    } catch (error) {
        res.status(400).json({
            message: "Book validation failed",
            error: error.message
        });
    }
});

// Read
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching books",
            error: error.message
        });
    }
});

// Search Book
app.get("/books/search", async (req, res) => {
    try {
        const book = await Book.find({
            title: { $regex: req.query.title || "", $options: "i" }
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: "Book search failed",
            error: error.message
        });
    }
});

// get book by id
app.get('/books/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Book ID" });
        }

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching book",
            error: error.message
        });
    }
});

// UPDATE
app.put("/books/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Book ID" });
        }

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({
            message: "Book updated successfully",
            data: book
        });
    } catch (error) {
        res.status(400).json({
            message: "Book update failed",
            error: error.message
        });
    }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Book ID" });
        }

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book is deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Book delete failed",
            error: error.message
        });
    }
});

app.listen(PORT,()=>console.log("Server running at port",PORT))
