module.exports = function(broadcast) {
  const router = require("express").Router();

  // Enviar comando para todos os clientes conectados ao WS
  router.post("/send", (req, res) => {
    const { comando, valor } = req.body;

    if (!comando) {
      return res.status(400).json({ erro: "Campo 'comando' é obrigatório." });
    }

    const payload = {
      type: "comando",
      comando,
      valor: valor || null,
      data: new Date().toISOString()
    };

    broadcast(payload);

    return res.json({ status: "enviado", payload });
  });

  // Teste simples de API
  router.get("/status", (req, res) => {
    res.json({ api: "online", ws: "ok" });
  });

  return router;
};
