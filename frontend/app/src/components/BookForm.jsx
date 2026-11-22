
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

function BookForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState({
        title: '',
        author: '',
        description: '',
        PublisherYear: ''
    });

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/books/${id}`)
                .then(response => setBook(response.data))
                .catch(error => alert("Error fetching book"));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setBook(prevBook => ({
            ...prevBook,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!book.title.trim() || !book.author.trim() || !book.description.trim() || !book.PublisherYear) {
            alert("Please fill all fields");
            return;
        }

        if (Number(book.PublisherYear) < 1000 || Number(book.PublisherYear) > new Date().getFullYear()) {
            alert("Please enter a valid Publisher Year");
            return;
        }

        if (id) {
            axios.put(`http://localhost:5000/books/${id}`, book)
                .then(() => {
                    alert("Book updated successfully");
                    navigate('/');
                })
                .catch(error => {
                    alert(error.response?.data?.error || error.response?.data?.message || "Error updating book");
                });
        } else {
            axios.post('http://localhost:5000/books', book)
                .then(() => {
                    alert("Book added successfully");
                    navigate('/');
                })
                .catch(error => {
                    alert(error.response?.data?.error || error.response?.data?.message || "Error adding book");
                });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    value={book.title}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                    type="text"
                    name="author"
                    value={book.author}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={book.description}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Publisher Year</Form.Label>
                <Form.Control
                    type="number"
                    name="PublisherYear"
                    value={book.PublisherYear}
                    onChange={handleChange}
                    min="1000"
                    max={new Date().getFullYear()}
                    required
                />
            </Form.Group>

            <Button type="submit" variant="primary">
                {id ? "Update Book" : "Add Book"}
            </Button>
        </Form>
    );
}

export default BookForm;
