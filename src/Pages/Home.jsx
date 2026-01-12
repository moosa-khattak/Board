import React, { useContext, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { TaskContext } from "../context/TaskContext.jsx";
import Board from "../Component/Board.jsx";
import Task from "../Component/Task.jsx";
import Button from "../Component/Button.jsx";
import Modal from "../Component/Modal.jsx";

import { updateTaskBoard, createBoard, fetchBoards } from "../api/taskApi.js";

const Home = () => {
  const { boards, updateBoardTasks } = useContext(TaskContext);

  const [newBoardName, setNewBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  /* ===================== DRAG HANDLERS ===================== */
  const handleDragStart = (event) => {
    setActiveTask(event.active.data.current.task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id.replace("task-", "");
    const targetBoardId = over.id.replace("board-", "");
    const sourceBoardId = active.data.current.task.boardId;

    if (Number(sourceBoardId) === Number(targetBoardId)) return;

    try {
      await updateTaskBoard(taskId, Number(targetBoardId));
      const data = await fetchBoards();
      updateBoardTasks(data);
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };

  /* ===================== CREATE BOARD ===================== */
  const handleCreateBoard = async (e) => {
    if (e) e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      await createBoard({
        name: newBoardName,
        userId: 1, // temporary (replace with auth user)
      });

      const data = await fetchBoards();
      updateBoardTasks(data);

      setNewBoardName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create board:", error);
    }
  };

  const submitOnEnter = (e) => {
    if (e.key === "Enter") {
      handleCreateBoard();
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen p-8 lg:p-12 overflow-x-hidden">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600">
              Task Boards
            </h1>
            <p className="text-gray-500 font-medium mt-1 text-lg">
              Manage your focus with style
            </p>
          </div>

          <Button
            onClick={() => setIsCreating(true)}
            className="shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
          >
            + New Board
          </Button>
        </div>

        {/* CREATE BOARD MODAL */}
        <Modal
          isOpen={isCreating}
          title="Add New Board"
          onClose={() => setIsCreating(false)}
          onConfirm={handleCreateBoard}
          confirmText="Create Board"
          confirmVariant="primary"
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Board Name
            </label>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={submitOnEnter}
              placeholder="e.g., Development, Marketing, Ideas"
              autoFocus
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                         focus:bg-white focus:ring-2 focus:ring-blue-500/50
                         focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </Modal>

        {/* BOARDS */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex flex-wrap justify-center items-start gap-8 pb-12">
            {boards.map((board, index) => (
              <Board
                key={board.id}
                board={board}
                isTaskCreatable={index === 0}
              />
            ))}

            {boards.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-3xl w-full max-w-2xl bg-white/30">
                <p className="text-xl font-medium">No boards found</p>
                <p className="mt-2">Create a new board to get started</p>
              </div>
            )}
          </div>

          {/* Drag Overlay - renders dragged task above everything */}
          <DragOverlay dropAnimation={null}>
            {activeTask ? <Task task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Home;
