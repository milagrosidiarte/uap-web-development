import type { APIRoute } from "astro";
import { tareas } from "../../../lib/tareas";

export const prerender = false;

export const POST: APIRoute = async ({ params, redirect }) => {
  const id = Number(params.id);
  if (!isNaN(id) && tareas[id]) {
    tareas[id].completada = !tareas[id].completada;
  }
  return redirect("/");
};
