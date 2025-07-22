const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

// Simulação em memória
let doors = [
  { id: '1', name: 'Porta Principal', status: 'closed' },
  { id: '2', name: 'Porta Fundos', status: 'closed' },
  { id: '3', name: 'Laboratório 1', status: 'closed' },
  { id: '4', name: 'Laboratório 2', status: 'closed' },
  { id: '5', name: 'Almoxarifado', status: 'closed' },
  { id: '6', name: 'Laboratório 3', status: 'closed' },
  { id: '7', name: 'Laboratório 4', status: 'closed' },
  { id: '8', name: 'Laboratório 5', status: 'closed' },
  { id: '9', name: 'Laboratório 6', status: 'closed' },
  { id: '10', name: 'Laboratório 7', status: 'closed' },
];

let logs = [];

function addLog(user, doorId, action) {
  const door = doors.find((d) => d.id === doorId);
  logs.unshift({
    id: nanoid(),
    user,
    door: door?.name ?? doorId,
    action,
    datetime: new Date().toISOString(),
  });
  // mantém no máximo 1000 logs na memória
  if (logs.length > 1000) logs.pop();
}

// GET /api/doors
app.get('/api/doors', (_req, res) => {
  res.json(doors);
});

// POST /api/doors/:id/open
// POST /api/doors/:id/close
app.post('/api/doors/:id/:command', (req, res) => {
  const { id, command } = req.params;
  const door = doors.find((d) => d.id === id);
  if (!door) return res.status(404).json({ error: 'Door not found' });

  if (command === 'open' && door.status === 'closed') {
    door.status = 'open';
    addLog('SimulatedUser', id, 'open');
  } else if (command === 'close' && door.status === 'open') {
    door.status = 'closed';
    addLog('SimulatedUser', id, 'close');
  } else {
    return res.status(400).json({ error: 'Invalid command' });
  }

  return res.json({ success: true, status: door.status });
});

// GET /api/logs
app.get('/api/logs', (_req, res) => {
  res.json(logs);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚪 Porta simulator rodando em http://localhost:${PORT}`);
}); 