import { useEffect, useState } from "react";
import api from "../utils.js";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader.jsx";
import Message from "../components/message.jsx";

const Logout = ()=> {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
        try{
          const response = await api.get("/user/logout");
          if(response.data.code === 200) navigate("/login");
        }catch(error){
            setMessage("Server down, try later!");
            setLoading(false);
        }
        };
        fetch();
      }, [navigate]);

      if(loading) return(<Loader />)
      else if(message) return <Message text={message} />
}

export default Logout;