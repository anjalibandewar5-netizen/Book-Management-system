
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function BookList() {
    const [books, setBooks] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        axios.get('http://localhost:5000/books')
            .then(response => setBooks(response.data))
            .catch(error => console.log(error));
    }, []);

    // Search Book
    const handleSearch = () => {
        axios.get(`http://localhost:5000/books/search?title=${encodeURIComponent(search)}`)
            .then(response => setBooks(response.data))
            .catch(error => console.log(error));
    }

    // Show All Books
    const handleShowAll = () => {
        setSearch('');
        axios.get('http://localhost:5000/books')
            .then(response => setBooks(response.data))
            .catch(error => console.log(error));
    }

    // Delete Book with Confirmation
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this book?");

        if (confirmDelete) {
            axios.delete(`http://localhost:5000/books/${id}`)
                .then(() => {
                    setBooks(prevBooks =>
                        prevBooks.filter(book => book._id !== id)
                    );
                    alert("Book deleted successfully");
                })
                .catch(error => {
                    console.log(error);
                    alert("Error deleting book");
                });
        }
    }

    return (
        <>
            <Link to="/add" className="btn btn-primary mb-3">
                Add New Book
            </Link>

            {/* Search */}
            <div className="d-flex mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search Book by Title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Button
                    variant="success"
                    className="ms-2"
                    onClick={handleSearch}
                >
                    Search
                </Button>

                <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={handleShowAll}
                >
                    Show All
                </Button>
            </div>

            {/* Book Table */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Description</th>
                        <th>Publisher Year</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map(book => (
                        <tr key={book._id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.description}</td>
                            <td>{book.PublisherYear}</td>
                            <td>
                                <Link
                                    to={`/edit/${book._id}`}
                                    className="btn btn-warning me-2"
                                >
                                    Edit
                                </Link>

                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(book._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default BookList
