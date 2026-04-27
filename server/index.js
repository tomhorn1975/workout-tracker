const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const { initDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

initDb();

app.use(cors());
app.use(express.json());

app.use('/api/machines', require('./routes/machines'));
app.use('/api/sessions', require('./routes/sessions'));

const clientBuild = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`\nWorkout Tracker running`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${ip}:${PORT}  <-- use this on your phone\n`);
});
