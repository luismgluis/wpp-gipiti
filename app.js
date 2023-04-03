const express = require('express');
// const { getCalendarClient } = require('./src/calendarClient');
const { wppMessageController } = require('./src/controllers/wppMessageController');

const { wppClient } = require('./src/wppClient');

const app = express()
const port = 6001;
let lastQR = null;
let wppAuth = false;

const allResponses = {}

// const calendarClient = getCalendarClient()

const client = wppClient({
  onAuthenticated: () => {
    console.log('Cliente de WhatsApp autenticado');
    wppAuth = true;
    // calendarClient.auth()
  },
  onClientReady: () => {
    console.log('Cliente de WhatsApp listo');
  },
  onQrGenerate: (svg) => {
    console.log('Generando código QR de WhatsApp...');
    lastQR = svg;
  },
  onMessage: (msg) => {
    console.log('Mensaje de WhatsApp recibido:', msg.body);
    wppMessageController.onMessage(msg, allResponses);
  }
});

app.get('/restart', (req, res) => {
  client.restart();
  res.send('El servicio de WhatsApp se está reiniciando...');
});


app.get('/', (req, res) => {
  if (wppAuth) return res.send("wpp authenticated");
  res.send(lastQR)
})
app.get('/gipiti', (req, res) => {
  wppMessageController.gipiti()
  res.send("ok")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})