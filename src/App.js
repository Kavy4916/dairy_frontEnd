import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Entry from "./pages/entry/entry.jsx";
import CheckList from "./pages/checkList/checkList.jsx";

function App() {
  // State to store title and content
  

  return (
    <div>
    <Router>
    <Routes>
             <Route  index element={<Entry />}/>
             <Route  path="/check-list" element={<CheckList />}/>
    </Routes>
    </Router>
    </div>
  );
}

export default App;
