import React, { useState, useEffect } from "react";
import api from "../utils.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import Message from "../components/message.jsx";

function Entry() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const response = await api.get(`/entry/getPage`, { params: { page } });
      if (response.data.code === 200) {
        setEntries(response.data.entries);
        setCount(response.data.count);
        setPage(response.data.page);
      } else if (response.data.code === 201) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate(response.data.path, {replace: true});
        }, 2000);
      } else if (response.data.code === 400) navigate("/login", {replace: true});
      setLoading(false);
    } catch (error) {
      setMessage("Server down, try later!");
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      await fetchEntries();
    };
    fetch();
  }, [page, navigate]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/entry/create", { title, content });
      if (response.data.code === 200) {
        setTitle("");
        setContent("");
        setSuccess(response.data.message);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        await fetchEntries(); // Refresh entries after submission
      } else if (response.data.code === 201) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate(response.data.path, {replace: true});
        }, 2000);
      } else if (response.data.code === 202) {
        setError(response.data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else if (response.data.code === 400)
        navigate("/login", { replace: true });
    } catch (error) {
      setMessage("Server down, try later!");
    }
  };

  const handelEntryEdit = async (e) => {
    e.preventDefault();
    navigate(`/entry/edit/${e.target.id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  } else if (message) return <Message text={message} />;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Create a New Diary Entry</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label htmlFor="title" className="block font-medium mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              minLength={10}
              maxLength={80}
              className="w-full p-2 border rounded"
              placeholder="Diary Title"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block font-medium mb-2">
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              minLength={30}
              maxLength={300}
              className="w-full p-2 border rounded h-32 resize-none"
              placeholder="Write your thoughts..."
              required
            />
          </div>
          {error && <p className="text-red-600 text-center my-2">{error}</p>}
          {success && (
            <p className="text-green-600 text-center my-2">{success}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Add Entry
          </button>
        </form>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Diary Entries</h3>
          {entries.length === 0 ? (
            <p>No entries yet. Start writing!</p>
          ) : (
            <ul className="space-y-4 break-words">
              {entries.map((entry) => (
                <li key={entry._id} className="p-4 bg-gray-100 rounded shadow">
                  <h4 className="text-lg font-semibold">{entry.title}</h4>
                  <p className="text-xs mb-1">
                    {new Date(entry.createdAt).toLocaleDateString("en-UK")}
                  </p>
                  <p>{entry.content}</p>
                  <div className="flex justify-end">
                    <button
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                      id={entry._id}
                      onClick={handelEntryEdit}
                    >
                      EDIT
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(count / 10)}
          </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={page * 10 >= count}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Entry;
