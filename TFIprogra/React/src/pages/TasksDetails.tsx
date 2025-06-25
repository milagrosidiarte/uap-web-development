import { useParams } from "@tanstack/react-router";

export function TasksDetails() {
  const { taskId } = useParams({ from : "/tasks/$taskId" });
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Details</h1>
      <p className="text-gray-700">Details for task ID: {taskId}</p>
      {/* Additional task details can be displayed here */}
    </div>
  );
}