import React, { useEffect, useState } from 'react';

function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = 'http://localhost:7070';

    useEffect(() => {
        getItems()
    }, [])

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res)
            })
    }

    const handleSubmit = () => {
        setError("")
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })
                .then((res) => {
                    if (res.ok) {
                        setTodos([...todos, { title, description }]);
                        setMessage("Item added successfully");
                        setTimeout(() => {
                            setMessage("")
                        }, 2000);
                        setTitle('');
                        setDescription('');
                    } else {
                        setError("Unable to create Todo item");
                    }
                })
                .catch((error) => {
                    setError("An error occurred: " + error.message);
                });
        } else {
            setError("Title and Description cannot be empty");
        }
    };

    const handleEdit = (item) => {
        console.log('item id', item._id)
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description)
    }

    const handleUpdate = () => {
        setError("")
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            })
                .then((res) => {
                    if (res.ok) {

                        const updateTodos = todos.map((item) => {
                            if (item._id === editId) {
                                item.title = editTitle;
                                item.description = editDescription;
                            }
                            return item;
                        })
                        setTodos(updateTodos);
                        setMessage("Item updated successfully");
                        setTimeout(() => {
                            setMessage("")
                        }, 3000);

                        setEditId(-1);

                    } else {
                        setError("Unable to create Todo item");
                    }
                })
                .catch((error) => {
                    setError("An error occurred: " + error.message);
                });
        } else {
            setError("Title and Description cannot be empty");
        }
    }

    const handleEditCancel = () => {
        setEditId(-1)
    }


    const handleDelete = (id) => {
        if (window.confirm("Are you sure want to delete")) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id)
                    setTodos(updatedTodos)
                })
        }
    }


    return (
        <div>
            <div className="row p-3 bg-success text-light">
                <h1>ToDo Project with MERN stack</h1>
            </div>

            <div className='m-5'>
                <div className="row">
                    <h3>Add Item</h3>
                    {message && <p className="text-success">{message}</p>}
                    <div className="form-group d-flex gap-2">
                        <input
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            className="form-control"
                        />
                        <input
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="form-control"
                        />
                        <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                </div>
                <div className="row mt-3">
                    {todos.length === 0 ? "" : <h3>Task</h3>}
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {editId === item._id ? (
                                        <>
                                            <div className="form-group d-flex gap-2">
                                                <input
                                                    placeholder="Title"
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    value={editTitle}
                                                    className="form-control"
                                                />
                                                <input
                                                    placeholder="Description"
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    value={editDescription}
                                                    className="form-control"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </>
                                    )}
                                </div>

                                <div className="d-flex gap-2">
                                    {editId === item._id ? (
                                        <>
                                            <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
                                            <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div></div>
        </div>
    );
}

export default Todo;
