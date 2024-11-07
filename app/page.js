"use client";
import TaskDialog from "@/components/taskDialog";
import { useState, useEffect } from "react";
import { addTask, deleteTask, useFetchTasks } from "./utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  const { tasks, setTasks, loading, setLoading } = useFetchTasks();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (tasks) {
      setTodos(tasks);
    }
  }, [tasks]);

  async function handleDelete(id) {
    const data = await deleteTask(id);
    console.log("DELETEdata", data);
    setLoading(true);

    const tempTasks = tasks.filter((task) => task._id !== id);
    console.log("tasks", tempTasks);
    setTasks(tempTasks);
    setLoading(false);
  }

  const handleTaskAdded = async () => {
    // Fetch tasks again to update the task list after adding a new task
    setLoading(true);
    try {
      const { tasks: updatedTasks } = await fetch("/api/tasks");
      console.log("LLDL:", tasks);
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <TaskDialog onTaskAdded={handleTaskAdded} />
      <ul>
        {/* {tasks &&
          tasks.map((task) => (
            <li key={task._id}>
              <TaskDialog
                task={task.task}
                id={task._id}
                priority={task.priority}
              />
              <Button
                variant="outline"
                onClick={() => {
                  handleDelete(task._id);
                }}
              >
                Mark as done
              </Button>
            </li>
          ))} */}

        {tasks &&
          tasks.map((task) => {
            const priority = task.priority || "low"; // Default to "low" if no priority is provided
            const bgColor =
              priority === "high"
                ? "bg-red-500 hover:bg-red-600"
                : priority === "medium"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"; // Low priority (default)

            return (
              <li key={task._id}>
                <TaskDialog
                  task={task.task}
                  id={task._id}
                  priority={priority}
                />
                <Button
                  variant="outline"
                  className={`${bgColor} text-white`}
                  onClick={() => handleDelete(task._id)}
                >
                  Mark as done
                </Button>
              </li>
            );
          })}
      </ul>
    </>
  );
}
