const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
    next();
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Servidor Express está funcionando!");
});

app.get("/proxy/item-details/:assetId", async (req, res) => {
    const assetId = req.params.assetId;
    const url = `https://catalog.roblox.com/v1/catalog/items/${assetId}/details?itemType=Asset`;

    try {
        const response = await axios.get(url);

        const unitsAvailableForConsumption = response.data.unitsAvailableForConsumption || 0;
        const totalQuantity = response.data.totalQuantity || 0;

        // Formata a resposta como "unidades disponíveis: 14.999/15.000"
        const message = `Unidades disponíveis: ${unitsAvailableForConsumption.toLocaleString()}/${totalQuantity.toLocaleString()}`;

        res.json({ message });
    } catch (error) {
        console.error("Erro ao buscar dados da API Roblox:", error.response?.data || error.message);

        res.status(500).json({
            error: "Erro ao buscar dados da API Roblox",
            details: error.response?.data || error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy rodando em http://localhost:${PORT}`);
});
