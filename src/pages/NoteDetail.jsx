import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import styled from "styled-components";

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
    e.target.innerText = "Deleting...";
    const res = await fetch(`${API_URL}/note/${noteData.NoteID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.ok) navigate("/");
  }

  return (
    noteData && noteData.NoteID?
      <NoteContainer className="note-container">
        <div className="content-container">
          <h3 className="note-title">{noteData.Title}</h3>
          <p className="note-datetime">created on: {new Date(noteData.CreatedAt).toLocaleDateString()} @ {new Date(noteData.CreatedAt).toLocaleTimeString()}</p>
          <p className="note-content">{noteData.Content}</p>
        </div>
        {noteData.FileURL && <img className="note-img" src={noteData.FileURL}/>}
        <button className="delete-button" onClick={handleDelete}>Delete Note</button>
      </NoteContainer>
    : noteData &&
      <p className="not-found-message">Note not found. :(</p>
  )
}

const NoteContainer = styled.div`
  align-items: flex-start;
  background: #f2f5fa;
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 5%;
  justify-content: center;
  margin: 40px auto;
  padding: 32px 24px;
  width: 80%;
  .content-container {
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-flow: column;
    gap: 10px;
    padding: 20px;
    width: 60%;
  }
  .note-title {
    margin: 0;
    font-size: 40px;
  }
  .note-datetime {
    margin: 0;
    font-style: italic;
    color: gray;
  }
  .note-content {
    font-size: 18px;
    text-align: justify;
    width: 100%;
  }
  .note-img {
    border-radius: 10px;
    justify-content: center;
    min-width: 100px;
    max-height: 300px;
    max-width: 300px;
    width: auto;
    height: auto;
  }
  .delete-button {
    border: none;
    border-radius: 10px;
    background-color: #ff0936;
    color: #fff;
    display: block;
    font-size: 16px;
    font-weight: 500;
    height: 40px;
    margin: 100px 40% 0;
    min-width: 200px;
    &:hover {
      cursor: pointer;
      background-color: #ca0126;
      font-size: 18px;
      transition: 200ms;
    }
  }
  @media screen and (max-width: 1300px) {
    background: #fff;
    .content-container {
      align-items: center;
      background-color: #ffffff00;
      text-align: center;
      width: 95%;
    }
    .delete-button {
      margin-top: 30px;
    }
  }
`;
