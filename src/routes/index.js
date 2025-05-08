// Arquivo de índice para centralizar rotas
const express = require("express");
const artigosRoutes = require("./artigos.routes");
const avaliacoesRoutes = require("./avaliacoes.routes");
const comentariosRoutes = require("./comentarios.routes");
const eventosRoutes = require("./eventos.routes");
const usuariosRoutes = require("./usuarios.routes");

const router = express.Router();

// Configura as rotas para cada entidade
router.use("/artigos", artigosRoutes);
router.use("/avaliacoes", avaliacoesRoutes);
router.use("/comentarios", comentariosRoutes);
router.use("/eventos", eventosRoutes);
router.use("/usuarios", usuariosRoutes);

module.exports = router;
