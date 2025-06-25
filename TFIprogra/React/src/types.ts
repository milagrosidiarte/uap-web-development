export type Task = {
  id: string;
  text: string;
  done: boolean;
};
  
export let tasks: Task[] = [];

let nextId = 1;

export function generateId() {
  return String(nextId++);
};