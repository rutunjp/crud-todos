"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addTask, updateTask } from "@/app/utils";

export default function TaskDialog({ task, priority, id, onTaskAdded }) {
  const [localTask, setLocalTask] = useState(task || "");
  const [localPriority, setLocalPriority] = useState(priority || "low");

  const handleSave = async () => {
    const newTask = { task: localTask, priority: localPriority };

    if (id) {
      await updateTask(id, newTask);
      setLocalTask(newTask.task);
    } else {
      await addTask(newTask);
      onTaskAdded();
    }
  };
  useEffect(() => {
    setLocalTask(task || "");
    setLocalPriority(priority); // Setting default value for priority if not provided
  }, [task, priority]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-24" variant="link">
          {task || "New task"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task || "New Task"}</DialogTitle>
          <DialogDescription>Make changes to task.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Task
            </Label>
            <Input
              onChange={(e) => {
                setLocalTask(e.target.value);
              }}
              id="name"
              value={localTask}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Priority
            </Label>
            <RadioGroup
              defaultValue={localPriority || "low"} // Set the default value for the radio group
              onValueChange={(value) => {
                console.log("value", value);
                setLocalPriority(value);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="r1" />
                <Label htmlFor="r1">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="r2" />
                <Label htmlFor="r2">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="r3" />
                <Label htmlFor="r3">High</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
