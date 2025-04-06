import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas.ts";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const data = await request.formData();
  const id = Number(data.get("id"));
  const tareas = locals.tareas || [];

  if (tareas[id]) tareas[id].completada = !tareas[id].completada;

  locals.tareas = tareas;
  return redirect("/");
};
