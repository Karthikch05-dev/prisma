import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ?? 4000;

app.use(express.json());

// Serve static frontend for mobile PPG (camera-based pulse measurement)
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: publicPath });
});

// Placeholder route until Prisma client is configured
app.get("/patients/count", (_req, res) => {
  res.json({ count: null, note: "Prisma client not configured in this quick-run mode" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
