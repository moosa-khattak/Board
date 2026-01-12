import React from "react";
import { TaskProvider } from "./context/TaskContext.jsx";
import Home from "./Pages/Home.jsx";

function App() {
  return (
    <TaskProvider>
      
      <Home />
    </TaskProvider>
  );
}

export default App;
