import './App.css';
import {useState,useEffect} from 'react'
import Home from './components/home'
import Nothome from './components/nothome'
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom'

function App() {
  <Router>
    <Route exact path="/home" component={Home}>kkkkkk</Route>
    <Route exact path="/nothome" component={Nothome}></Route>
  </Router>
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
  let csrftoken = getCookie('csrftoken')

  const handleSubmit=(e)=>{
    e.preventDefault()
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
    ...activeItem,
    id: null,
    title: "",
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
    })
  }
  const strikeUnstrike=(task)=>{
    task.completed = !task.completed
    fetch(`http://127.0.0.1:8000/api/task-update/${task.id}/`,{
      method: 'POST',
      headers : {
        'content-type': 'application/json',
        'X-CSRFToken' : csrftoken
      },
      body : JSON.stringify({completed:task.completed, title:task.title})

    }).then(()=>{
      fetchTasks()
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
                  {task.completed ?(<strike onClick={()=>strikeUnstrike(task)} className="title">{task.title}</strike>)
                  : (<span onClick={()=>strikeUnstrike(task)} className="title">{task.title}</span>)}                 
                  <button onClick={()=>task.completed || setActiveItem({id:task.id,title:task.title,completed:task.completed})} className="button">edit</button>
                  <button className="button" onClick={()=>handleDelete(task.id)}>delete</button>
                </div>
              )
          })
        }
      </div>
    </div>
  );
}

export default App;