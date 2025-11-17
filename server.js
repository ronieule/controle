const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// --------- WEBSOCKET SERVER ----------
const wss = new WebSocket.Server({ noServer: true });

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on("connection", (ws) => {
  console.log("🟢 WebSocket conectado");
  
  ws.send(JSON.stringify({ type: "status", msg: "conectado" }));

  ws.on("close", () => console.log("🔴 WebSocket desconectado"));
});

// --------- HTTP + WS UPGRADE ----------
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log("🌐 API ativa em /api");
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit("connection", ws, req);
  });
});

// --------- ROTAS DA API ----------
app.use("/api", require("./routes/api")(broadcast));
