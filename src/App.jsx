import React, { useState, useRef } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useAtom } from "jotai";
import { tasksWithStorageAtom } from "./data/atoms";

const INICIAL_STATE = "";

const App = () => {
  const [tasks, setTasks] = useAtom(tasksWithStorageAtom);
  const [formData, setFormData] = useState(INICIAL_STATE);
  const [error, setError] = useState("");
  const cuadradoRef = useRef(null);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formData.trim()) {
      setError("Please enter a task");
      return;
    }
    const task = {
      id: Date.now(),
      title: formData,
      completed: false,
    };
    setTasks([...tasks, task]);
    setFormData(INICIAL_STATE);
    setError("");
  };

  const handleOnChange = (e) => {
    setFormData(e.target.value);
    if (error) setError("");
  };

  const handleTaskClick = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const taskId = Number(e.currentTarget.dataset.id);

    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
      },
    });
  };

  const handleScroll = () => {
    const element = cuadradoRef.current;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    if (scrollTop === 0) {
      element.classList.add("rebound-top");
      setTimeout(() => element.classList.remove("rebound-top"), 300);
    } else if (scrollTop + clientHeight >= scrollHeight) {
      element.classList.add("rebound-bottom");
      setTimeout(() => element.classList.remove("rebound-bottom"), 300);
    }
  };

  const handleDeleteAll = () => {
    if (tasks.length > 0) {
      Modal.confirm({
        title: "Are you sure you want to delete all tasks?",
        okText: "Yes",
        okType: "danger",
        onOk: () => setTasks([]),
      });
    }
  };

  const handleDeleteCompleted = () => {
    if (tasks.filter((task) => task.completed).length > 0) {
      Modal.confirm({
        title: "Are you sure you want to delete completed tasks?",
        okText: "Yes",
        okType: "danger",
        onOk: () => {
          const updatedTasks = tasks.filter((task) => !task.completed);
          setTasks(updatedTasks);
        },
      });
    }
  };

  return (
    <div className="App">
      <h1>My To Do List</h1>
      <form className="form" onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="Enter your task"
          value={formData}
          onChange={handleOnChange}
        />
        <button type="submit">Add Task</button>
      </form>
      {error && (
        <p style={{ color: "red" }} className="error">
          {error}
        </p>
      )}
      {tasks.filter((task) => !task.completed).length !== 0 && (
        <p>{tasks.filter((task) => !task.completed).length} tasks left</p>
      )}
      <div className="cuadrado">
        <div className="todo-list" ref={cuadradoRef} onScroll={handleScroll}>
          {tasks.map((task) => (
            <div
              key={task.id}
              className="task"
              onClick={() => handleTaskClick(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "gray" : "inherit",
                cursor: "pointer",
              }}
            >
              <p className={task.completed ? "completed" : "p"}>{task.title}</p>
              <DeleteOutlined
                className="delete-icon"
                onClick={handleDelete}
                data-id={task.id}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="botones">
        <button
          onClick={handleDeleteCompleted}
          disabled={tasks.filter((task) => task.completed).length === 0}
        >
          Clear Completed
        </button>
        <button onClick={handleDeleteAll} disabled={tasks.length === 0}>
          Clear All
        </button>
      </div>
      <div className="footer">
        <p>Created by: Eng. Alian Villa Ochoa</p>
        <p>Copyright © 2025. All rights reserved.</p>
      </div>
    </div>
  );
};

export default App;
