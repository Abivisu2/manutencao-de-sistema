// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './controller.js'; // Importa nossas rotas

// Carrega as variáveis de ambiente do .env
dotenv.config();

// Inicializa o Express
const app = express();

// --- Middlewares ---
// Habilita o CORS (para que qualquer front-end possa acessar)
app.use(cors());

// Habilita o Express para entender requisições com corpo em JSON
app.use(express.json());

// --- Rotas ---
// Define um prefixo para todas as rotas da API
app.use('/api', apiRoutes);

// Rota "raiz" apenas para checagem
app.get('/', (req, res) => {
  res.send('API Lista de Compras está no ar!');
});

// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 3000; // Usa a porta do .env ou 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});