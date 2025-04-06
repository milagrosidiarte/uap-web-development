// import type { APIRoute } from "astro";
// import { tareas } from "../../lib/tareas.ts";
// export const prerender = false;

// export const POST: APIRoute = async ({ locals, redirect }) => {
//   const tareas = locals.tareas || [];
//   locals.tareas = tareas.filter(t => !t.completada);
//   return redirect("/");
// };

import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas";

export const POST: APIRoute = async ({ redirect }) => {
  // Filtramos para quedarnos solo con las incompletas
  for (let i = tareas.length - 1; i >= 0; i--) {
    if (tareas[i].completada) {
      tareas.splice(i, 1);
    }
  }

  return redirect("/");
};
