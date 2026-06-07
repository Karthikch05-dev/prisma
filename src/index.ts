import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(express.json());

// Serve static frontend for mobile PPG (camera-based pulse measurement)
app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// Placeholder route until Prisma client is configured
app.get("/patients/count", (_req, res) => {
  res.json({ count: null, note: "Prisma client not configured in this quick-run mode" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
