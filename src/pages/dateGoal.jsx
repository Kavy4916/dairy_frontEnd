import React, { useState, useEffect } from "react";
import api from "../utils.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import Message from "../components/message.jsx";

function GoalDate() {
  const [goals, setGoals] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const today = new Date().toISOString().split("T")[0];
  const tomorrow =
    today.split("-")[0] +
    "-" +
    today.split("-")[1] +
    "-" +
    (parseInt(today.split("-")[2]) + 1);

  const [date, setDate] = useState(tomorrow);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get(`/goal/date`, { params: { date } });
        if (response.data.code === 200) {
          setGoals(response.data.goals);
          setTotalScore(
            response.data.goals.reduce((acc, entry) => acc + entry.score, 0)
          );
          setUserScore(
            response.data.goals.reduce(
              (acc, entry) => (entry.status ? acc + entry.score : acc),
              0
            )
          );
        } else if (response.data.code === 201) {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate(response.data.path);
          }, 2000);
        } else if (response.data.code === 400) navigate("/login");
        setLoading(false);
      } catch (error) {
        setMessage("Server down, try later");
      }
    };
    fetchGoals();
  }, [navigate, date]);

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (e) => {
    setDisabled(e.target.value > today);
    setDate(e.target.value);
  };

  const handlegoalEdit = async (e) => {
    e.preventDefault();
    const _id = e.target.id;
    navigate(`/goal/edit/${_id}`);
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
        <div>
          <div className="flex justify-between items-center mb-4">
            <label htmlFor="date" className=" font-medium text-2xl mb-1">
              Date:
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-4/5 p-2 border rounded text-l"
              required
            />
          </div>
          <h1 className="text-2xl text-center font-bold mb-2">
            {`Goals for ${formatDate(date)}`}
          </h1>
          {goals.length === 0 ? (
            <p className="text-gray-600 text-xl font-semibold">
              {date < today ? `No goals were set for ${formatDate(date)}!`:`No goals are set for ${formatDate(date)}!`}
            </p>
          ) : (
            <>
              {!disabled && (
                <div className="text-lg font-medium mb-4 text-center">
                  Total Score: {userScore}/{totalScore} (
                  {totalScore ? Math.ceil((userScore * 100) / totalScore) : 0}%)
                </div>
              )}
              <ul className="space-y-4">
                {goals.map((entry) => (
                  <li
                    key={entry._id}
                    className="p-4 bg-gray-100 rounded shadow break-words"
                  >
                    {" "}
                    <div>
                      <span className="font-semibold mr-1">Goal:</span>
                      {" " + entry.goal}
                    </div>
                    <p>
                      <span className="font-semibold mr-1">Score:</span>
                      {" " + entry.score}
                    </p>
                    {!disabled &&
                      <>
                        <p>
                          <span className="font-semibold mr-1">Remark:</span>
                          {" " + (entry.remark || "N/A")}
                        </p>
                        <p>
                          <span className="font-semibold mr-1">Status:</span>
                          {" " + (entry.status ? "Completed" : "Incomplete")}
                        </p>
                      </>
                    }
                    <div className="flex justify-end">
                      <button
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                        type="submit"
                        id={entry._id}
                        onClick={handlegoalEdit}
                      >
                        EDIT
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default GoalDate;
