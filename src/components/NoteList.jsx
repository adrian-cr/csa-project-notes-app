import { useNavigate } from 'react-router-dom'


export default function NoteList({data}) {
  const navigate = useNavigate();
  return ( data &&
    <>
      <div className="note-list-container">
        {
          data.map(n =>
            <div className="note-card" onClick={() => navigate("/note/" + n.NoteID)}>
              <h3 className="note-title">{n.Title}</h3>
              <p className="note-datetime">{new Date(n.CreatedAt).toLocaleString()}</p>
              <p className="note-content">{n.Content}</p>
              {n.FileURL && <img className="note-img" src={n.FileURL}/>}
            </div>
          )
        }
      </div>
    </>
  )
}
