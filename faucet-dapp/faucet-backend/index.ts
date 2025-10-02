import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import faucetRoutes from "./routes/faucet";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/faucet", faucetRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});
