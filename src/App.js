import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Entry from "./pages/entry.jsx";
import Goal from "./pages/goal.jsx";
import Login from "./pages/login.jsx";
import EditEntry from "./pages/editEntry.jsx";
import Logout from "./pages/logout.jsx";
import EditGoal from "./pages/editGoal.jsx";
import Yesterday from "./pages/yesterday.jsx";
import GoalDate from "./pages/dateGoal.jsx";
import Register from "./pages/register.jsx";

function App() {
  // State to store title and content
  

  return (
    <div>
    <Router>
    <Routes>
             <Route index element={<Goal />}/>
             <Route path="/entry" element={<Entry />}/>
             <Route path="/login" element={<Login />}/>
             <Route path="/entry/edit/:_id" element={<EditEntry />}/>
             <Route path="/goal/edit/:_id" element={<EditGoal />}/>
             <Route path="/goal/yesterday" element={<Yesterday />}/>
             <Route path="/goal/date" element={<GoalDate />}/>
             <Route path="/logout" element={<Logout />}/>
             <Route path="/register" element={<Register />}/>
    </Routes>
    </Router>
    </div>
  );
}

export default App;
