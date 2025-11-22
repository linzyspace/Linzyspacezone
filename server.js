import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
