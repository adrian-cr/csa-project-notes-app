import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import NoteDetail from "./pages/NoteDetail";
import NewNote from "./pages/NewNote";
import "./App.css"

export default function App() {
  return (
    <Router className="body">
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/new-note" element={<NewNote/>}></Route>
        <Route path="/note/:id" element={<NoteDetail/>}/>
      </Routes>
    </Router>
  );
}
