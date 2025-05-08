// Rotas para Eventos
import express from "express";
const router = express.Router();
import EventoService from "../services/EventoService";

// Obter todos os eventos
router.get("/", (req, res) => {
  try {
    const eventos = EventoService.getAll();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// Obter um evento pelo ID
router.get("/:id", (req, res) => {
  try {
    const evento = EventoService.getById(req.params.id);

    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar evento" });
  }
});

// Criar um novo evento
router.post("/", (req, res) => {
  try {
    const novoEvento = EventoService.create(req.body);
    res.status(201).json(novoEvento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar evento" });
  }
});

// Atualizar um evento
router.put("/:id", (req, res) => {
  try {
    const eventoAtualizado = EventoService.update(req.params.id, req.body);

    if (!eventoAtualizado) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(eventoAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar evento" });
  }
});

// Excluir um evento
router.delete("/:id", (req, res) => {
  try {
    const result = EventoService.delete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir evento" });
  }
});

// Adicionar avaliador a um evento
router.post("/:id/avaliadores", (req, res) => {
  try {
    const { avaliadorId } = req.body;

    if (!avaliadorId) {
      return res.status(400).json({ error: "ID do avaliador é obrigatório" });
    }

    const result = EventoService.addAvaliador(req.params.id, avaliadorId);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Evento não encontrado ou avaliador já adicionado" });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar avaliador" });
  }
});

// Remover avaliador de um evento
router.delete("/:id/avaliadores/:avaliadorId", (req, res) => {
  try {
    const result = EventoService.removeAvaliador(
      req.params.id,
      req.params.avaliadorId
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Evento não encontrado ou avaliador não encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover avaliador" });
  }
});

// Adicionar artigo a um evento
router.post("/:id/artigos", (req, res) => {
  try {
    const { artigoId } = req.body;

    if (!artigoId) {
      return res.status(400).json({ error: "ID do artigo é obrigatório" });
    }

    const result = EventoService.addArtigo(req.params.id, artigoId);

    if (!result) {
      return res
        .status(404)
        .json({ error: "Evento não encontrado ou artigo já adicionado" });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar artigo" });
  }
});

// Remover artigo de um evento
router.delete("/:id/artigos/:artigoId", (req, res) => {
  try {
    const result = EventoService.removeArtigo(
      req.params.id,
      req.params.artigoId
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Evento não encontrado ou artigo não encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover artigo" });
  }
});

// Obter eventos por criador
router.get("/criador/:criadorId", (req, res) => {
  try {
    const eventos = EventoService.getByCriador(req.params.criadorId);
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// Obter eventos ativos (data atual entre início e fim)
router.get("/status/ativos", (req, res) => {
  try {
    const eventos = EventoService.getEventosAtivos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos ativos" });
  }
});

// Obter eventos futuros (data atual antes do início)
router.get("/status/futuros", (req, res) => {
  try {
    const eventos = EventoService.getEventosFuturos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos futuros" });
  }
});

// Obter eventos passados (data atual após o fim)
router.get("/status/passados", (req, res) => {
  try {
    const eventos = EventoService.getEventosPassados();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar eventos passados" });
  }
});

module.exports = router;
