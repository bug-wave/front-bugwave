// Rotas para Artigos
import express from "express";
const router = express.Router();
import ArtigoService from "../services/ArtigoService";

// Obter todos os artigos
router.get("/", (req, res) => {
  try {
    const artigos = ArtigoService.getAll();
    res.json(artigos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar artigos" });
  }
});

// Obter um artigo pelo ID
router.get("/:id", (req, res) => {
  try {
    const artigo = ArtigoService.getById(req.params.id);

    if (!artigo) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    res.json(artigo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar artigo" });
  }
});

// Criar um novo artigo
router.post("/", (req, res) => {
  try {
    const novoArtigo = ArtigoService.create(req.body);
    res.status(201).json(novoArtigo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar artigo" });
  }
});

// Atualizar um artigo
router.put("/:id", (req, res) => {
  try {
    const artigoAtualizado = ArtigoService.update(req.params.id, req.body);

    if (!artigoAtualizado) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    res.json(artigoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar artigo" });
  }
});

// Excluir um artigo
router.delete("/:id", (req, res) => {
  try {
    const result = ArtigoService.delete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir artigo" });
  }
});

// Adicionar comentário a um artigo
router.post("/:id/comentarios", (req, res) => {
  try {
    const { comentarioId } = req.body;

    if (!comentarioId) {
      return res.status(400).json({ error: "ID do comentário é obrigatório" });
    }

    const result = ArtigoService.addComentario(req.params.id, comentarioId);

    if (!result) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar comentário" });
  }
});

// Adicionar avaliação a um artigo
router.post("/:id/avaliacoes", (req, res) => {
  try {
    const { avaliacaoId } = req.body;

    if (!avaliacaoId) {
      return res.status(400).json({ error: "ID da avaliação é obrigatório" });
    }

    const result = ArtigoService.addAvaliacao(req.params.id, avaliacaoId);

    if (!result) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar avaliação" });
  }
});

// Atualizar status de um artigo
router.put("/:id/status", (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status é obrigatório" });
    }

    const artigoAtualizado = ArtigoService.updateStatus(req.params.id, status);

    if (!artigoAtualizado) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    res.json(artigoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar status do artigo" });
  }
});

export default router;
