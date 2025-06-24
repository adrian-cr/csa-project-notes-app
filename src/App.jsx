import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import NoteDetail from "./pages/NoteDetail";

export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/note/:id" element={<NoteDetail/>}/>
      </Routes>

    </Router>
  );
}
