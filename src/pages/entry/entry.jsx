import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./entry.module.css";

function Entry() {
  // State to store title and content
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        let response = await axios.get(`api/entry/page/`, {
          params: {
            page: 0,
          },
        });
        const options = { year: "numeric", month: "long", day: "numeric" };
        response.data.response = response.data.response.map((element) => ({
          ...element,
          entry_date: new Date(element.entry_date).toLocaleDateString(
            "en-US",
            options
          ),
        }));
        setEntries(response.data.response);
        setCount(response.data.count);
        setPage(response.data.page);
      } catch (error) {
        setError("Failed to load!");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    };
    fetch();
  }, [page]);

  // Handle input change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/entry/create_entry", {
        title,
        content,
      });
      setTitle("");
      setContent("");
      let response = await axios.get(`api/entry/page/`, {
        params: {
          page: page,
        },
      });
      const options = { year: "numeric", month: "long", day: "numeric" };
      response.data.response = response.data.response.map((element) => ({
        ...element,
        entry_date: new Date(element.entry_date).toLocaleDateString(
          "en-US",
          options
        ),
      }));
      setEntries(response.data.response);
      setCount(response.data.count);
      setPage(response.data.page);
    } catch (error) {
      setError("Failed to add the entry!");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      <h1>Create a New Diary Entry</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            minLength={10}
            maxLength={80}
            className={styles.input}
            placeholder="Diary Title"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            minLength={30}
            maxLength={300}
            className={styles.textarea}
            placeholder="Write your thoughts..."
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Add Entry
        </button>
      </form>

      <div className={styles.entriesContainer}>
        <h3>Your Diary Entries</h3>
        {entries.length === 0 ? (
          <p>No entries yet. Start writing!</p>
        ) : (
          <ul className={styles.entriesList}>
            {entries.map((entry) => (
              <li key={entry.id} className={styles.entryItem}>
                <h3>{entry.title}</h3>
                <p>{entry.content}</p>
                <div className={styles.date}>{entry.entry_date}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Entry;
