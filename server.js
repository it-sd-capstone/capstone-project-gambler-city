import express from 'express';
import bodyParser from 'body-parser'; // For parsing incoming request bodies

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Server listener
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
