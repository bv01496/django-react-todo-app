import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from 'react'

function App() {
  const[todoList,setTodoList] = useState([])
  const[activeItem,setActiveItem] = useState({
    id: null,
    title: "",
    completed: false
  })
  useEffect(()=>{
    fetchTasks()
  },[])
  const fetchTasks = async()=>{
    await fetch("http://127.0.0.1:8000/api/task-list/")
    .then(resp=> resp.json())
    .then(data=>setTodoList(data))
  }
  const handleChange=(e)=>{
    const name = e.target.name
    const value = e.target.value
    setActiveItem({
      ...activeItem,title: value
    })
  }
  const getCookie=(name)=>{
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    let csrftoken = getCookie('csrftoken')
    let url = ""
    activeItem.id?(url=`http://127.0.0.1:8000/api/task-update/${activeItem.id}/`)
    :(url= "http://127.0.0.1:8000/api/task-create/")
    fetch(url,{
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken
      },
      body: JSON.stringify(activeItem)
  }).then(()=>{
    fetchTasks()
    setActiveItem({
    id: null,
    title: "",
    completed: false
  }) 
  }).catch((error)=>{
    console.log('ERROR:' ,error);
  })
  }
  const handleDelete=(id)=>{
    fetch(`http://127.0.0.1:8000/api/task-delete/${id}/`,{
      method: 'DELETE',
    }).then(()=>{
      fetchTasks()
      setActiveItem({
      id: null,
      title: "",
      completed: false
  })
    })
  }

  return (
    <div className="App">
      <div className="add-task">
        <form id="form"  onSubmit={(e)=>handleSubmit(e)}>
          <input value={activeItem.title} name="title" type="text" id="todo_input" onChange={(e)=>handleChange(e)} placeholder="Add Task.."/>
          <button type="submit"> submit</button>
        </form>
      </div>
      <div className="all-task">
        {
          todoList.map((task)=>{
              return(
                <div className="task" key={task.id}>
                  <span className="title">{task.title}</span>

                  <button onClick={()=>setActiveItem({id:task.id,title:task.title,completed:task.completed})} className="button">edit</button>
                  <button className="button" onClick={()=>handleDelete(task.id)}>done</button>
                </div>
              )
          })
        }
      </div>
    </div>
  );
}

export default App;