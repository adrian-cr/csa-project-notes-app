import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

const API_URL = "https://x8i1n01lw6.execute-api.us-east-2.amazonaws.com/dev";

export default function NoteDetail() {
  const [noteData, setNoteData] = useState(null);
  const {id} = useParams();
  const navigate = useNavigate();
  const fetchNote = async () => {
        const res = await fetch(`${API_URL}/note/${id}`);
        const note = await res.json();
        setNoteData(note);
    }
  useEffect(() => {fetchNote()}, [id]);

  const handleDelete = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/note/${noteData.NoteID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    });
    if (res.ok) navigate("/");
  }

  return (noteData && noteData.NoteID?
    <div className="note-container">
      <h3 className="note-title">{noteData.Title}</h3>
      <p className="note-datetime">{new Date(noteData.CreatedAt).toLocaleString()}</p>
      <p className="note-content">{noteData.Content}</p>
      {noteData.FileURL && <img className="note-img" src={noteData.FileURL}/>}
      <button className="delete-button" onClick={handleDelete}>Delete Note</button>
    </div>
    :
    <p className="not-found-message">Note not found. :(</p>
  )
}
