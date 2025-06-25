import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const API_URL = "https://x8i1n01lw6.execute-api.us-east-2.amazonaws.com/dev";

export default function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const fetchData = async() => {
        const res = await fetch(API_URL);
        const data = await res.json();
        const notes = JSON.parse(data.body);
        notes.sort((nA, nB) => new Date(nB.CreatedAt) - new Date(nA.CreatedAt));
        setData(notes);
    }
  useEffect(() => {fetchData()}, [data]);

  return (
      data &&
    <PageContainer>
      <div className="note-list-container">
        {
          data.map(n =>
            <div className={`note-card${n.FileURL? "": " no-file"}`} onClick={() => navigate("/note/" + n.NoteID)}>
              <h3 className="note-title">{n.Title}</h3>
              <p className="note-datetime">{new Date(n.CreatedAt).toLocaleString()}</p>
              <p className="note-content">{n.Content}</p>
              {n.FileURL && <img className="note-img" src={n.FileURL}/>}
            </div>
          )
        }
      </div>
      <Link to="/new-note">
        <button className="add-button">New Note</button>
      </Link>
    </PageContainer>
  );
}
const PageContainer = styled.main`
  align-items: center;
  display: flex;
  flex-flow: column;
  height: 85vh;
  justify-content: center;
  transform: translateY(-20px);
  .note-list-container {
    align-items: flex-start;
    background-color: #f8f8f883;
    border-radius: 20px;
    box-sizing: border-box;
    display: flex;
    gap: 40px;
    height: 75%;
    justify-content: flex-start;
    margin-bottom: 30px;
    overflow: scroll;
    padding: 10vh 50px;
    width: 95%;
    p, h3 {
      margin-top: 0;
    }
    p {
      font-size: 14px;
    }
    .note-card {
      align-items: center;
      background-color: #fff;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      flex-flow: column;
      justify-content: flex-satrt;
      max-height: 100%;
      overflow-y: scroll;
      padding: 20px;
      min-width: 250px;
      max-width: 250px;
      &:hover {
        background-color: #f0fbff;
        transform: translateY(-10px);
        transition: 500ms;
      }
      &.no-file .note-content {
        -webkit-line-clamp: 12;
      }
      .note-title {
        font-size: 20px;
        margin: 0;
      }
      .note-datetime {
        color: gray;
        font-size: 10px;
        font-style: italic;
        margin-top: 5px;
      }
      .note-content {
        display: inline-block;
        overflow: hidden;
        text-align: justify;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
      .note-img {
        border-radius: 10px;
        width: 70%;
      }
    }
  }
  .add-button {
    align-self: center;
    border: none;
    border-radius: 10px;
    background-color: #27bd86;
    color: #fff;
    display: block;
    font-size: 16px;
    font-weight: 500;
    height: 40px;
    width: 300px;
    &:hover {
      cursor: pointer;
      background-color: #1dc764;
      font-size: 18px;
      transition: 200ms;
    }
  }
`;
