import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Message from "../components/message.jsx";
import Loader from "../components/loader.jsx";
import { useState, useEffect } from "react";
import api from "../utils";

function EditGoal() {
  const { _id } = useParams();

  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const offset = new Date().getTimezoneOffset();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await api.get(`/goal/get`,{params: {_id}});
        if (response.data.code === 200) {
          setDisabled(response.data.goal.deadline < today);
          setGoal(response.data.goal);
        } else if (response.data.code === 201) {
          setMessage(response.data.message);
          setTimeout(() => {
            navigate(response.data.path);
          }, 2000);
        } else if (response.data.code === 400) navigate("/login");
      } catch (error) {
        setMessage("Server down, try later!");
      }
      setLoading(false);
    };
    fetch();
  }, [_id, navigate, today]);

  const handleChange = (event) => {
    const field = event.target.id;
    const value = event.target.value;
    setGoal({ ...goal, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let payload = {offset, _id: goal._id, remark: goal.remark};
    if(goal.deadline >= today) payload = {
      ...payload,
      goal:  goal.goal,
      score: goal.score,
      deadline: goal.deadline
    }
      try{
        const response = await api.post("/goal/edit",{ ...payload });
          if(response.data.code === 201){
            setMessage(response.data.message);
            setTimeout(() => {
              navigate(response.data.path);
            }, 2000);
          }
          else if(response.data.code === 202){
            setError(response.data.message);
            setTimeout(()=>{
              setError(null);
            },3000);
          }
          else if(response.data.code === 400) navigate("/login");
    }catch(error){
     setMessage("Server down, try later!")
    }
    setLoading(false);
  };

  const handelDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
      try{
        const response = await api.post("/goal/delete",{_id: goal._id, offset});
        if(response.data.code){
          if(response.data.code === 201){
            setMessage(response.data.message);
            setTimeout(() => {
              navigate(response.data.path);
            }, 2000);
          }
        }
    }catch(error){
      setMessage("Server down, try later!")
    }
    setLoading(false);
  };

  const handelCheckboxClick = (e) => {
    setChecked(e.target.checked);
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
        <h1 className="text-xl font-bold my-4">Edit Goal</h1>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label htmlFor="goal" className="block font-medium mb-1">
              Goal:
            </label>
            <input
              type="text"
              id="goal"
              disabled={disabled}
              value={goal.goal}
              onChange={handleChange}
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
              disabled={disabled}
              value={goal.score}
              onChange={handleChange}
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
              disabled={disabled}
              value={goal.deadline}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="remark" className="block font-medium mb-1">
              Remark:
            </label>
            <input
              type="text"
              id="remark"
              disabled={goal?.deadline > today}
              value={goal.remark || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              minLength={10}
              maxLength={100}
              placeholder="Give Remark"
            />
          </div>
          {error && <p className="text-red-600 text-center my-2">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Edit
          </button>
        </form>
        {!disabled && (
            <>
        <input
          type="checkbox"
          id="checkbox"
          checked={checked}
          onChange={handelCheckboxClick}
        />
        
            <label className={"ml-2 pointer-events-none"} htmlFor="checkbox">
              Click the checkbox to enable delete.
            </label>
            <button
              disabled={!checked}
              type="button"
              onClick={handelDelete}
              className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 my-2"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default EditGoal;