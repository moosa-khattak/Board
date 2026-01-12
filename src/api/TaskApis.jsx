import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/tasks`;
const BOARD_API_URL = `${API_BASE_URL}/api/boards`;

// Fetch all tasks
export const fetchTasks = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

// Fetch all boards
export const fetchBoards = async () => {
  const res = await axios.get(BOARD_API_URL);
  return res.data.data;
};

// Create a new task
export const createTask = async (task) => {
  const res = await axios.post(API_URL, task);
  return res.data.data;
};

// Update task board (drag & drop)
export const updateTaskBoard = async (taskId, boardId) => {
  const res = await axios.put(`${API_URL}/${taskId}`, { boardId });
  return res.data.data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const res = await axios.delete(`${API_URL}/${taskId}`);
  return res.data.data;
};

// Create a new board
export const createBoard = async (board) => {
  const res = await axios.post(BOARD_API_URL, board);
  return res.data.data;
};

// Delete a board
export const deleteBoard = async (boardId) => {
  const res = await axios.delete(`${BOARD_API_URL}/${boardId}`);
  return res.data.data;
};
