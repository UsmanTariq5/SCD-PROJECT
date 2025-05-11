// src/Home.js
import React, { useEffect, useState } from 'react';
import Create from './Create';
import API_URL from './config';
import './App.css';
import axios from 'axios';
import {
  BsCircleFill,
  BsFillCheckCircleFill,
  BsFillTrashFill,
  BsPencil
} from 'react-icons/bs';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [updatetask, setUpdatetask] = useState('');
  const [taskid, setTaskid] = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/get`)
      .then(result => setTodos(result.data))
      .catch(err => console.log(err));
  }, []);

  const edit = (id) => {
    axios
      .put(`${API_URL}/edit/${id}`)
      .then(result => {
        const updatedTodos = todos.map(todo =>
          todo._id === id ? { ...todo, done: !todo.done } : todo
        );
        setTodos(updatedTodos);
      })
      .catch(err => console.log(err));
  };

  const Update = (id, updatedTask) => {
    axios
      .put(`${API_URL}/update/${id}`, { task: updatedTask })
      .then(result => {
        const updatedTodos = todos.map(todo =>
          todo._id === id ? { ...todo, task: updatedTask } : todo
        );
        setTodos(updatedTodos);
        setTaskid('');
        setUpdatetask('');
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const Hdelete = (id) => {
    axios
      .delete(`${API_URL}/delete/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(err => console.log(err));
  };

  return (
    <main>
      <Create />
      {todos.length === 0 ? (
        <div className="task">No tasks found</div>
      ) : (
        todos.map(todo => (
          <div className="task" key={todo._id}>
            <div className="checkbox">
              {todo.done ? (
                <BsFillCheckCircleFill className="icon" />
              ) : (
                <BsCircleFill
                  className="icon"
                  onClick={() => edit(todo._id)}
                />
              )}
              {taskid === todo._id ? (
                <input
                  type="text"
                  value={updatetask}
                  onChange={e => setUpdatetask(e.target.value)}
                />
              ) : (
                <p className={todo.done ? 'through' : 'normal'}>
                  {todo.task}
                </p>
              )}
            </div>
            <div>
              <span>
                <BsPencil
                  className="icon"
                  onClick={() => {
                    if (taskid === todo._id) {
                      Update(todo._id, updatetask);
                    } else {
                      setTaskid(todo._id);
                      setUpdatetask(todo.task);
                    }
                  }}
                />
                <BsFillTrashFill
                  className="icon"
                  onClick={() => Hdelete(todo._id)}
                />
              </span>
            </div>
          </div>
        ))
      )}
    </main>
  );
};

export default Home;
