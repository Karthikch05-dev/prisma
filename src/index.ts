import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Placeholder route until Prisma client is configured
app.get("/patients/count", (_req, res) => {
  res.json({ count: null, note: "Prisma client not configured in this quick-run mode" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
