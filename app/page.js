"use client";
import TaskDialog from "@/components/taskDialog";
import { useState, useEffect } from "react";
import { deleteTask, useFetchTasks } from "./utils";
import { Button } from "@/components/ui/button";

export default function Home() {
  async function handleDelete(id) {
    const data = await deleteTask(id);
    console.log("DELETEdata", data);
  }
  const { tasks, loading } = useFetchTasks();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TaskDialog onTaskChange={useFetchTasks} />
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <TaskDialog task={task.task} id={task._id} />
            <Button
              size="2"
              variant="destructive"
              onClick={() => {
                handleDelete(task._id);
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
