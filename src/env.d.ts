/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
      tareas: {
        texto: string;
        completada: boolean;
      }[];
    }
  }
  