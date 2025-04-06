// import type { APIRoute } from "astro";
// import { tareas } from "../../lib/tareas.ts";
// export const prerender = false;

// export const POST: APIRoute = async ({ request, locals, redirect }) => {
//   const formData = await request.formData();
//   const id = Number(formData.get("id"));
//   const tareas = locals.tareas || [];

//   if (tareas[id]) tareas.splice(id, 1);

//   locals.tareas = tareas;
//   return redirect("/");
// };

import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const id = Number(formData.get("id"));

  if (!isNaN(id) && id >= 0 && id < tareas.length) {
    tareas.splice(id, 1); // elimina la tarea por índice
  }

  return redirect("/");
};
