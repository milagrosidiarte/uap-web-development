import type { APIRoute } from "astro";
import { tareas } from "../../lib/tareas.ts";
//let tareas: { texto: string; completada: boolean }[] = [];

//export const prerender = false;

// export const POST: APIRoute = async ({ request, locals, redirect }) => {
//   const formData = await request.formData();
//   const texto = formData.get("texto")?.toString() ?? "";

// //   tareas.push({ texto, completada: false });
// if (texto) {
//     tareas.push({ texto, completada: false });
// }
// locals.tareas = tareas;
// return redirect("/");
// };

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const texto = formData.get("texto");

  if (typeof texto === "string" && texto.trim() !== "") {
    tareas.push({ texto: texto.trim(), completada: false });
  }

  return redirect("/");
};
