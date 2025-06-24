import { useState } from 'react'

export default function NewNoteForm({url}) {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [file, setFile] = useState(null);
  const handleSubmit = async e => {
    e.preventDefault();
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
    const res = await fetch(`${url}/note`, {
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
    }
  }
  return (
    <form id="note-form">
      <input type="text" id="title" placeholder="Title" required onChange={e => setTitle(e.target.value)} />
      <textarea id="content" placeholder="Note content" required onChange={e => setContent(e.target.value)}></textarea>
      <input type="file" id="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Create Note</button>
    </form>
  )
}
