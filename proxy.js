const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware para CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// Rota para a raiz
app.get("/", (req, res) => {
    res.send("Servidor Express está funcionando!");
});

// Rota para detalhes do item
app.get("/proxy/item-details/:assetId", async (req, res) => {
    const assetId = req.params.assetId;
    const url = `https://catalog.roblox.com/v1/catalog/items/${assetId}/details?itemType=Asset`;

    try {
        const response = await axios.get(url);

        // Extraímos apenas o campo 'unitsAvailableForConsumption'
        const unitsAvailableForConsumption = response.data.unitsAvailableForConsumption || "N/A";

        // Enviamos o valor de 'unitsAvailableForConsumption' para o cliente
        res.json({ unitsAvailableForConsumption });
    } catch (error) {
        console.error("Erro ao buscar dados da API Roblox:", error);
        res.status(500).json({ error: "Erro ao buscar dados da API Roblox" });
    }
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Proxy rodando em http://localhost:${PORT}`);
});
