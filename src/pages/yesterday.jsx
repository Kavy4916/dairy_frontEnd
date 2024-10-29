import React, { useState, useEffect } from "react";
import api from "../utils.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Loader from "../components/loader.jsx";
import Message from "../components/message.jsx";

function Yesterday() {
  const [goals, setGoals] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const offset = new Date().getTimezoneOffset();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get(`/goal/yesterdayGoal`, { params: { offset } });
        if(response.data.code === 200){
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
        }
        else if(response.data.code === 201){
          setMessage(response.data.message);
          setTimeout(() => {
            navigate(response.data.path);
          }, 2000);
        }
        else if (response.data.code === 400) navigate("/login");
        setLoading(false);
      } catch (error) {
          setMessage("Server down, try later");
      }
    };
    fetchGoals();
  }, [navigate, offset]);

  const handleCheckboxClick = async (e) => {
    const _id = e.target.id;
    const status = e.target.checked;
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
          navigate(response.data.path);
        }, 2000);
      } else if (response.data.code === 400) navigate("/login");
    } catch (error) {
      setMessage("Server down, try later!");
    }
  };

  const handelgoalEdit = async (e)=>{
    e.preventDefault();
    const _id = e.target.id;
    navigate(`/goal/edit/${_id}`);
  }

  if(loading){
    return (
      <>
        <Navbar />
        <Loader />
      </>
    )
  }

  else if(message){
    return <Message text={message}/>
  }


  return (
    <>
    <Navbar />
    <div className="container mx-auto p-4 max-w-lg">
        <div>
          <h1 className="text-2xl text-center font-bold mb-2">
            Yesterday Goals
          </h1>
          {goals.length === 0 ? (
            <p className="text-gray-600 font-semibold">No goals were set for yesterday!</p>
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
                  {" "}
                    <div>
                      <span className="font-semibold mr-1">Goal:</span>{" " + entry.goal}
                    </div>
                    <p>
                      <span className="font-semibold mr-1">Score:</span>{" " + entry.score}
                    </p>
                    <p>
                      <span className="font-semibold mr-1">Remark:</span>{" " + (entry.remark || "N/A")}
                    </p>
                    <div className="flex items-center mt-1">
                      <label htmlFor={entry._id} className="font-semibold mr-2">
                        Done
                      </label>
                      <input
                        id={entry._id}
                        type="checkbox"
                        checked={entry.status || false}
                        onChange={handleCheckboxClick}
                        className="h-4 w-4"
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
        </div>
        </div>
    </>
  );
}

export default Yesterday;
