import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.json({
    status: 'ok',
    app: '{{projectName}}',
    message: '{{description}}'
  });
});

app.get('/api/message', (request, response) => {
  response.json({
    message: 'Hello from {{appName}} API'
  });
});

app.listen(PORT, () => {
  console.log(`{{appName}} API is running on http://localhost:${PORT}`);
});
