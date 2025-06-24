import { useState, useEffect } from 'react';
import NewNoteForm from '../components/NewNoteForm';
import NoteList from '../components/NoteList';

const API_URL = "https://x8i1n01lw6.execute-api.us-east-2.amazonaws.com/dev";

export default function Home() {
  const [data, setData] = useState([]);
  const fetchData = async() => {
        const res = await fetch(API_URL);
        const data = await res.json();
        const notes = JSON.parse(data.body);
        notes.sort((nA, nB) => new Date(nB.CreatedAt) - new Date(nA.CreatedAt));
        setData(notes);
    }
  useEffect(() => {fetchData()}, [data]);

  return (
    <>
      <NewNoteForm url={API_URL}/>
      <NoteList {...{data}}/>
    </>
  )
}
