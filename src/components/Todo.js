import { useState, useEffect } from "react";

import classes from "./Todo.module.css";
import TodoList from "./TodoList";

const ToDo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodo() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos?_limit=5"
        );
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        console.log(err);
      }
    }
    console.log("okay");
    fetchTodo();
  }, []);

  async function addTodo() {
    if (newTodo.trim() === "") {
      alert("Type something then add");
      return;
    }
    const newTask = { title: newTodo.trim(), completed: false };

    const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const resFromServer = await res.json();
    setNewTodo("");
    setTodos((preValue) => {
      return [...preValue, resFromServer];
    });
  }

  async function updateTodo(id) {
    setTodos((preTodos) =>
      preTodos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    const updatedItem = todos.find((item) => {
      return item.id === id;
    });
    try {
      await fetch(
        `https://jsonplaceholder.typicode.com/todos/${updatedItem.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedItem),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteTodo(id) {
    setTodos((preTodos) => {
      return preTodos.filter((item) => item.id !== id);
    });
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <p className={classes.label}>Add a To-Do</p>
      <div className={classes.inputContainer}>
        <input
          className={classes.todoInput}
          type="text"
          placeholder="Add Task...."
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
          }}
        />
        <button className={classes.addBtn} onClick={addTodo}>
          Add
        </button>
      </div>
      <TodoList
        todoItems={todos}
        handleCheckbox={updateTodo}
        deleteTodo={deleteTodo}
      />
    </>
  );
};

export default ToDo;
