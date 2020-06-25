import { createApp } from "./factory";

const app = createApp();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listen to port http://localhost:${port}`);
});
