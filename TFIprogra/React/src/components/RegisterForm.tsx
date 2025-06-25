import type { FormEvent } from "react";
import { useRegister } from "../hooks/useRegister";

export function RegisterForm() {
  const { register, isPending, isSuccess, isError, error } = useRegister();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    };

    register(data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-3">
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border border-gray-300 rounded-md p-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border border-gray-300 rounded-md p-2"
      />
      <button
        type="submit"
        className="bg-green-500 text-white rounded-md p-2"
        disabled={isPending}
      >
        {isPending ? "Registering..." : "Register"}
      </button>

      {isSuccess && <p className="text-green-600">User registered successfully!</p>}
      {isError && <p className="text-red-600">{(error as Error).message}</p>}
    </form>
  );
}
