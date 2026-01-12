import { createContext, useState, useEffect } from "react";
import { fetchBoards, updateTaskBoard } from "../api/TaskApis.jsx";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetchBoards().then((data) => {
      setBoards(data);
    });
  }, []);

  const updateBoardTasks = (updatedBoards) => setBoards(updatedBoards);

  return (
    <TaskContext.Provider value={{ boards, updateBoardTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
