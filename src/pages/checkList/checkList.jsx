import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./checklist.module.css";

function CheckList() {
  // State to store title and content
  const [goal, setGoal] = useState("");
  const [score, setScore] = useState(null);
  const [checkList, setCheckList] = useState([]);
  const [error, setError] = useState(null);
  const offset = new Date().getTimezoneOffset();
  const [totalScore, setTotalScore] = useState(0);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        let response = await axios.get(`api/checkList`,{
            params:{
                offset
            }
        });
        setTotalScore(response.data.response.reduce((accumulator, entry) => {
          return accumulator + entry.score;
        }, 0))
        setUserScore(response.data.response.reduce((accumulator, entry) => {
          if(entry.status) return accumulator + entry.score;
          else return accumulator;
        }, 0))
        setCheckList(response.data.response);
      } catch (error) {
        setError("Failed to load!");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    };
    fetch();
  }, []);

  // Handle input change
  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };


  const handelCheckboxClick = async (e) => {
    e.preventDefault();
    const id = parseInt(e.target.id);
    const status =  e.target.checked ? 1 : 0 ;
    const response = await axios.post("api/checklist/check",{id, status, offset});
    setCheckList(response.data.response);
    setTotalScore(response.data.response.reduce((accumulator, entry) => {
      return accumulator + entry.score;
    }, 0))
    setUserScore(response.data.response.reduce((accumulator, entry) => {
      if(entry.status) return accumulator + entry.score;
      else return accumulator;
    }, 0))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("/api/checklist/create_goal", {
        goal,
        score,
        offset
      });
      setGoal("");
      setScore(0);
      setTotalScore(response.data.response.reduce((accumulator, entry) => {
        return accumulator + entry.score;
      }, 0))
      setUserScore(response.data.response.reduce((accumulator, entry) => {
        if(entry.status) return accumulator + entry.score;
        else return accumulator;
      }, 0))
      setCheckList(response.data.response);
    } catch (error) {
      setError("Failed to add the goal!");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}
      <h1>Create a New Goal</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <div className={styles.label}><label htmlFor="goal">Goal:</label></div>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={handleGoalChange}
            className={styles.input}
            minLength={10}
            maxlength={100}
            placeholder="Enter your goal"
            required
          />
        </div>
        <div className={styles.formGroup}>
        <div className={styles.label}>Score:</div>
        <input
            id="score"
            type="number"
            value={score}
            onChange={handleScoreChange}
            className={styles.input}
            placeholder="Enter Score"
            min={1}
            max={10}
            required
        />
        </div>
        <button type="submit" className={styles.button}>
          Add Goal
        </button>
      </form>
      <div className={styles.totalScore}>Total-Score: {userScore}/{totalScore} ({Math.ceil((userScore*100)/totalScore)}%)</div>
      <div className={styles.entriesContainer}>
        <h3 className={styles.listHeading}>Your Goals For the Day</h3>
        {checkList.length === 0 ? (
          <p>No entries yet. Start writing!</p>
        ) : (
          <div className={styles.entriesList}>
            {checkList.map((entry) => (
              <div key={entry.id} className={styles.entryItem}>
                <div>Goal: {entry.goal}</div>
                <p>Score: {entry.score}</p>
                 <div className={styles.checkbox}> Done
                <input
                  id={entry.id}
                  type="checkbox"
                  checked={entry.status ? true : false}
                  onChange={handelCheckboxClick}>
                </input>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckList;
