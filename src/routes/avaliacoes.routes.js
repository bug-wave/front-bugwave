// Rotas para Avaliações
import express from "express";
const router = express.Router();
import AvaliacaoService from "../services/AvaliacaoService";

// Obter todas as avaliações
router.get("/", (req, res) => {
  try {
    const avaliacoes = AvaliacaoService.getAll();
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// Obter uma avaliação pelo ID
router.get("/:id", (req, res) => {
  try {
    const avaliacao = AvaliacaoService.getById(req.params.id);

    if (!avaliacao) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliação" });
  }
});

// Criar uma nova avaliação
router.post("/", (req, res) => {
  try {
    const novaAvaliacao = AvaliacaoService.create(req.body);
    res.status(201).json(novaAvaliacao);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar avaliação" });
  }
});

// Atualizar uma avaliação
router.put("/:id", (req, res) => {
  try {
    const avaliacaoAtualizada = AvaliacaoService.update(
      req.params.id,
      req.body
    );

    if (!avaliacaoAtualizada) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    res.json(avaliacaoAtualizada);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar avaliação" });
  }
});

// Excluir uma avaliação
router.delete("/:id", (req, res) => {
  try {
    const result = AvaliacaoService.delete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Avaliação não encontrada" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir avaliação" });
  }
});

// Obter avaliações por avaliador
router.get("/avaliador/:avaliadorId", (req, res) => {
  try {
    const avaliacoes = AvaliacaoService.getByAvaliador(req.params.avaliadorId);
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// Obter avaliações com nota mínima
router.get("/nota/minima/:nota", (req, res) => {
  try {
    const notaMinima = parseFloat(req.params.nota);

    if (isNaN(notaMinima)) {
      return res.status(400).json({ error: "Nota inválida" });
    }

    const avaliacoes = AvaliacaoService.getByNotaMinima(notaMinima);
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar avaliações" });
  }
});

// Calcular média de notas
router.post("/media", (req, res) => {
  try {
    const { avaliacoesIds } = req.body;

    if (!avaliacoesIds || !Array.isArray(avaliacoesIds)) {
      return res.status(400).json({ error: "IDs de avaliações inválidos" });
    }

    const media = AvaliacaoService.calcularMediaNotas(avaliacoesIds);
    res.json({ media });
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular média de notas" });
  }
});

export default router;
