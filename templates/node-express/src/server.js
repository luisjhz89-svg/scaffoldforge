import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.get('/health', (request, response) => {
  response.json({
    status: 'ok',
    service: '{{projectName}}',
    message: '{{description}}'
  });
});

app.get('/', (request, response) => {
  response.json({
    message: 'Welcome to {{appName}}',
    status: 'running'
  });
});

app.listen(PORT, () => {
  console.log(`{{appName}} listening on http://localhost:${PORT}`);
});
