import { useMessageStore } from "../store/messageStore";

export function Stats() {
  const messages = useMessageStore((s) => s.messages);

  return (
    <div className="flex flex-row justify-center gap-4">
      <div className="flex gap-2 border border-gray-300 p-4 rounded-md">
        <p>Total messages: {messages.length}</p>
      </div>
      <div className="flex gap-2 border border-gray-300 p-4 rounded-md">
        <p>
          Total likes: {messages.reduce((acc, curr) => acc + curr.likes, 0)}
        </p>
      </div>
    </div>
  );
}
