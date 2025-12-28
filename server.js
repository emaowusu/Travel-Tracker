import app from "./app.js";

const port = process.env.SERVER_PORT;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${port}`);
});
