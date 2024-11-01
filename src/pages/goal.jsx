import React, { useState, useEffect} from "react";
import api, {getToday} from "../utils.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Message from "../components/message.jsx";
import Loader from "../components/loader.jsx";
import Checkbox from "../components/checkbox.jsx";

function Goal() {
  const [goal, setGoal] = useState("");
  const [score, setScore] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const offset = new Date().getTimezoneOffset();
  const today = getToday(offset);
  const [quote, setQuote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get(`/goal/todayGoal`, {
          params: { offset },
        });
        if (response.data.code === 200) {
          setTotalScore(
            response.data.goals.reduce((acc, entry) => acc + entry.score, 0)
          );
          setUserScore(
            response.data.goals.reduce(
              (acc, entry) => (entry.status ? acc + entry.score : acc),
              0
            )
          );
          setGoals(response.data.goals);
          setQuote(response.data.quote);
        } else if (response.data.code === 201) {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate(response.data.path);
          }, 2000);
        } else if (response.data.code === 400) navigate("/login");
        setLoading(false);
      } catch (error) {
        setMessage("Server down, try later!");
      }
    };
    fetchGoals();
  }, [navigate, offset]);

  const handleGoalChange = (e) => setGoal(e.target.value);
  const handleScoreChange = (e) => setScore(e.target.value);
  const handleDeadlineChange = (e) => setDeadline(e.target.value);

  const handleCheckboxClick = async (_id, status) => {
    try {
      const response = await api.post("/goal/check", {
        _id,
        status,
        offset,
      });
      if (response.data.code === 200) {
        setGoals(prev => 
          prev.map(item => 
            item._id === _id ? { ...item, status: !item.status } : item
          )
        );
        const index = goals.findIndex(obj=> obj._id === _id);
        setUserScore(status ? userScore + goals[index].score : userScore - goals[index].score );
      } else if (response.data.code === 201) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate(response.data.path, {replace: true});
        }, 2000);
      } else if (response.data.code === 400) navigate("/login", {replace: true});
    } catch (error) {
      setMessage("Server down, try later!");
    }
  };


  
  const handelgoalEdit = async (e) => {
    e.preventDefault();
    const _id = e.target.id;
    navigate(`/goal/edit/${_id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/goal/create", {
        goal,
        score,
        offset,
        deadline,
      });
      if (response.data.code === 200) {
        if(deadline === today){
          console.log(deadline.length);
          setGoals([ ...goals, response.data.goal]);
          setTotalScore(totalScore + response.data.goal.score);
        }
        setGoal("");
        setScore(0);
        setDeadline("");
        setSuccess(response.data.message);
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
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
      } else if (response.data.code === 400) navigate("/login", {replace: true});
    } catch (error) {
      setMessage("Server down, try later!");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  } else if (message) {
    return <Message text={message} />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-lg">
        <div className="mb-2">
          <h1 className="text-2xl text-center font-bold mb-2">Quote of the Day</h1>
          <div className="bg-gray-100 p-4 rounded ">
          <div className="font-semibold text-xl">{quote.q}</div>
          <div className="flex justify-end"><p>{quote.a}</p></div>
          </div>
        </div>
          <h1 className="text-2xl text-center font-bold mb-2">
            Your Goals for the Day
          </h1>
          {goals.length === 0 ? (
            <p className="text-gray-600 font-semibold">No goals yet. Start creating!</p>
          ) : (
            <>
              <div className="text-lg font-medium mb-4 text-center">
                Total Score: {userScore}/{totalScore} (
                {totalScore ? Math.ceil((userScore * 100) / totalScore) : 0}%)
              </div>
              <ul className="space-y-4">
                {goals.map((entry) => (
                  <li
                    key={entry._id} 
                    className="p-4 bg-gray-100 rounded shadow break-words"
                  >
                    <div>
                      {" "}
                      <span className="font-semibold mr-1">Goal:</span>{" "}
                      {entry.goal}
                    </div>
                    <p>
                      <span className="font-semibold mr-1">Score:</span>{" "}
                      {entry.score}
                    </p>
                    <p>
                          <span className="font-semibold mr-1">Remark:</span>
                          {" " + (entry.remark || "N/A")}
                    </p>
                    <div className="flex items-center mt-1">
                      <label htmlFor={entry._id} className="font-semibold mr-2">
                        Done
                      </label>
                      <Checkbox id={entry._id}
                        status={entry.status}
                        handleClick={handleCheckboxClick}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                        type="submit"
                        id={entry._id}
                        onClick={handelgoalEdit}
                      >
                        EDIT
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        <h2 className="text-xl font-bold my-4">Create a New Goal</h2>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label htmlFor="goal" className="block font-medium mb-1">
              Goal:
            </label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={handleGoalChange}
              className="w-full p-2 border rounded"
              minLength={10}
              maxLength={200}
              placeholder="Enter your goal"
              required
            />
          </div>
          <div>
            <label htmlFor="score" className="block font-medium mb-1">
              Score:
            </label>
            <input
              id="score"
              type="number"
              value={score}
              onChange={handleScoreChange}
              className="w-full p-2 border rounded"
              placeholder="Enter Score"
              min={1}
              max={10}
              required
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block font-medium mb-1">
              Deadline:
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={handleDeadlineChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-600 text-center my-2">{error}</p>}
          {success && <p className="text-green-600 text-center my-2">{success}</p>}
          <button
            type="submit"
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Add Goal
          </button>
        </form>
      </div>
    </>
  );
}

export default Goal;
