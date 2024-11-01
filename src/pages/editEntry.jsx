import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar.jsx";
import Message from "../components/message.jsx";
import Loader from "../components/loader.jsx"
import { useState, useEffect } from "react";
import api from "../utils";

function EditEntry() {
    const {_id} = useParams();

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [entry, setEntry] = useState(null);
    const [checked, setChecked] = useState(false);

useEffect(()=>{
    const fetch = async ()=>{
        try{
            const response = await api.get(`/entry/get/${_id}`);
              if(response.data.code === 200){
                setEntry(response.data.entry);
              }
              else if(response.data.code === 201){
                setMessage(response.data.message);
                setTimeout(() => {
                  navigate(response.data.path, {replace: true});
                }, 2000);
              }
              else if(response.data.code === 400) navigate("/login", {replace: true});
        }catch(error){
          setMessage("Server down, try later!");
        }
        setLoading(false);
    }
    fetch();
},[_id, navigate]);

const handleChange = (event)=>{
  const field = event.target.id;
  const value = event.target.value;
  setEntry({...entry, [field]: value});
}

const handleSubmit = async (e)=>{
  setLoading(true);
  e.preventDefault();
  try{
    const response = await api.post("/entry/edit",{_id: entry._id, set: entry});
      if(response.data.code === 201){
        setMessage(response.data.message);
        setTimeout(() => {
          navigate(response.data.path, {replace: true});
        }, 2000);
      }
      else if(response.data.code === 202){
        setError(response.data.message);
        setTimeout(()=>{
          setError(null);
        },3000);
      }
      else if(response.data.code === 400) navigate("/login", {replace: true});
}catch(error){
 setMessage("Server down, try later!")
}
setLoading(false);
}

const handelDelete = async (e)=>{
  e.preventDefault();
  setLoading(true);
  try{
    const response = await api.post("/entry/delete",{_id: entry._id});
    if(response.data.code){
      if(response.data.code === 201){
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/entry", {replace: true});
        }, 2000);
      }
    }
}catch(error){
  setMessage("Server down, try later!")
}
setLoading(false);
}

const handelCheckboxClick = (e)=>{
  setChecked(e.target.checked);
}

if(loading) {
  return <>
    <Navbar />
    <Loader />
  </>
}
else if(message) {
  return <Message text={message}/>
}

return (
<>
      <Navbar />
      <div className="container mx-auto p-4 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Edit Entry</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="title" className="block font-medium mb-2">Title:</label>
            <input
              type="text"
              id="title"
              value={entry.title}
              onChange={handleChange}
              minLength={10}
              maxLength={80}
              className="w-full p-2 border rounded"
              placeholder="Diary Title"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block font-medium mb-2">Content:</label>
            <textarea
              id="content"
              value={entry.content}
              onChange={handleChange}
              minLength={30}
              maxLength={300}
              className="w-full p-2 border rounded h-32 resize-none"
              placeholder="Write your thoughts..."
              required
            />
          </div>
          {error && <p className="text-red-600 text-center my-2">{error}</p>}
          <button type="submit" className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 my-2">
            EDIT
          </button>
        </form>
        <input  type="checkbox" id="checkbox" checked={checked} onChange={handelCheckboxClick}/>
        <label className={"ml-2 pointer-events-none"} htmlFor="checkbox">Click the checkbox to enable delete.</label>
        <button disabled={!checked} type="button" onClick={handelDelete} className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 my-2">
            DELETE
        </button>
        </div>
        </>
        )

}

export default EditEntry;