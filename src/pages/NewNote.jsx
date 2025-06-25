import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const API_URL = "https://x8i1n01lw6.execute-api.us-east-2.amazonaws.com/dev";

export default function NewNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async e => {
    e.preventDefault();
    e.target.innerText = "Creating..."
    let base64 = null;
    if (file) {
      base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result.split(',')[1];
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
    const res = await fetch(`${API_URL}/note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        content,
        fileName: file?.name,
        contentType: file?.type,
        file: base64,
      }),
    });
    if (res.ok) {
      setTitle(null);
      setContent(null);
      setFile(null);
      document.getElementById("note-form").reset();
      navigate("/");
    }
  }
  const isFormValid = () => (title!=="" && content!=="");
  return (
    <PageContainer>
      <h1 className="page-title">New Note</h1>
      <form className="form" id="note-form">
        <label for="title">Title</label>
        <input type="text" id="title" placeholder="My Note Title" required onChange={e => setTitle(e.target.value)} />
        <label for="title">Your Note</label>
        <textarea className="content-input" id="content" placeholder="Add your notes here..." required onChange={e => setContent(e.target.value)}></textarea>
        <input className="file-input" type="file" id="file" onChange={e => setFile(e.target.files[0])} />
        <button className={`submit-button${isFormValid()? "" : " disabled"}`} onClick={handleSubmit}>Create Note</button>
      </form>
    </PageContainer>
  )
}
const PageContainer = styled.main`
  align-items: center;
  display: flex;
  flex-flow: column;
  height: 85vh;
  justify-content: center;
  .page-title {
    margin-top: 0;
  }
  .form {
    background-color: #fff;
    border-radius: 20px;
    display: flex;
    flex-flow: column;
    height: 70%;
    padding: 20px;
    width: 70%;
    min-width: 200px;
    label {
      font-size: 20px;
      margin-bottom: 5px;
    }
    input, textarea {
      border: 0;
      font-size: 20px;
      min-height: 40px;
      margin-bottom: 20px;
      padding: 5px;
    }
    input:not(.file-input), textarea {
      background-color: #edf1f8;

      border-radius: 5px;
      box-sizing: border-box;
      resize: none;
      &:hover {
        background-color: #d8e4fd;
        transition: 300ms;
      }
      &:focus {
        border: solid 3px #1678f0;
        background-color: #fcfcfc;
        outline: none;
        transition: 100ms;
      }
    }
    .content-input {
      height: 200px;
    }
    .file-input {
      background-color: unset;
      color: #116cd4;
      font-style: italic;
    }
    .submit-button {
      align-self: center;
      border: none;
      border-radius: 10px;
      background-color: #085bdf;
      color: #fff;
      display: block;
      font-size: 16px;
      font-weight: 500;
      height: 40px;
      margin: 0 20%;
      min-width: 30%;
      max-width: 300px;
      &.disabled {
        background-color: #c8c7c7;
        pointer-events: none;
      }
      &:hover {
        cursor: pointer;
        background-color: #036bf3;
        font-size: 18px;
        transition: 200ms;
      }
    }
  }
`;
