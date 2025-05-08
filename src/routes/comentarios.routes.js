// Rotas para Comentários
import express from "express";
const router = express.Router();
import ComentarioService from "../services/ComentarioService";

// Obter todos os comentários
router.get("/", (req, res) => {
  try {
    const comentarios = ComentarioService.getAll();
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
});

// Obter um comentário pelo ID
router.get("/:id", (req, res) => {
  try {
    const comentario = ComentarioService.getById(req.params.id);

    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comentário" });
  }
});

// Criar um novo comentário
router.post("/", (req, res) => {
  try {
    const novoComentario = ComentarioService.create(req.body);
    res.status(201).json(novoComentario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar comentário" });
  }
});

// Atualizar um comentário
router.put("/:id", (req, res) => {
  try {
    const comentarioAtualizado = ComentarioService.update(
      req.params.id,
      req.body
    );

    if (!comentarioAtualizado) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    res.json(comentarioAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar comentário" });
  }
});

// Excluir um comentário
router.delete("/:id", (req, res) => {
  try {
    const result = ComentarioService.delete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Comentário não encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir comentário" });
  }
});

// Obter comentários por autor
router.get("/autor/:autorId", (req, res) => {
  try {
    const comentarios = ComentarioService.getByAutor(req.params.autorId);
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
});

// Buscar comentários por texto
router.get("/busca/texto", (req, res) => {
  try {
    const { texto } = req.query;

    if (!texto) {
      return res.status(400).json({ error: "Texto de busca é obrigatório" });
    }

    const comentarios = ComentarioService.searchByText(texto);
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar comentários" });
  }
});

export default router;
