import React, { useState, useContext } from "react";
import Task from "./Task";
import Modal from "./Modal";
import { useDroppable } from "@dnd-kit/core";
import { createTask, fetchBoards, deleteBoard } from "../api/TaskApis.jsx";
import { TaskContext } from "../context/TaskContext";

const Board = ({ board, isTaskCreatable }) => {
  const { setNodeRef } = useDroppable({
    id: `board-${board.id}`,
    data: { board },
  });

  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { updateBoardTasks } = useContext(TaskContext);

  const handleCreateTask = async (e) => {
    if (e) e.preventDefault();
    if (!newTaskDesc.trim()) return;

    try {
      await createTask({
        description: newTaskDesc,
        boardId: board.id,
        userId: 1, // Hardcoded for now
      });

      const data = await fetchBoards();
      updateBoardTasks(data);
      setNewTaskDesc("");
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const confirmDeleteBoard = async () => {
    try {
      await deleteBoard(board.id);
      const data = await fetchBoards();
      updateBoardTasks(data);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete board", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreateTask();
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className="glass rounded-xl p-5 w-80 m-4 flex flex-col h-[75vh] relative group transition-all duration-300 hover:shadow-xl hover:bg-white/40 z-10"
      >
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              {board.name}
            </h2>
            <span className="bg-white/60 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/40 shadow-sm">
              {board.tasks.length}
            </span>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-md"
            title="Delete Board"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {board.tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
          {board.tasks.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm italic border-2 border-dashed border-gray-300/50 rounded-lg">
              No tasks yet
            </div>
          )}
        </div>

        {isTaskCreatable && (
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <div className="relative group/input">
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a new task..."
                className="w-full pl-3 pr-10 py-2.5 text-sm bg-white/60 border border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all shadow-sm group-hover/input:bg-white"
              />
              <button
                onClick={handleCreateTask}
                className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete Board"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteBoard}
        confirmText="Delete"
        confirmVariant="danger"
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-gray-900">{board.name}</strong>? This will
          permanently remove all tasks within this board.
        </p>
      </Modal>
    </>
  );
};

export default Board;
