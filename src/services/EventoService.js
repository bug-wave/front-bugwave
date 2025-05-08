// Serviço para entidade Evento
const eventosMock = require("../data/eventos.mock");

class EventoService {
  constructor() {
    this.eventos = eventosMock;
  }

  // Obtém todos os eventos
  getAll() {
    return this.eventos;
  }

  // Obtém um evento pelo ID
  getById(id) {
    return this.eventos.find((evento) => evento.id === id);
  }

  // Adiciona um novo evento
  create(eventoData) {
    const novoEvento = {
      ...eventoData,
      id: (this.eventos.length + 1).toString(),
      artigos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.eventos.push(novoEvento);
    return novoEvento;
  }

  // Atualiza um evento existente
  update(id, eventoData) {
    const index = this.eventos.findIndex((evento) => evento.id === id);

    if (index === -1) {
      return null;
    }

    const eventoAtualizado = {
      ...this.eventos[index],
      ...eventoData,
      updatedAt: new Date(),
    };

    this.eventos[index] = eventoAtualizado;
    return eventoAtualizado;
  }

  // Remove um evento
  delete(id) {
    const index = this.eventos.findIndex((evento) => evento.id === id);

    if (index === -1) {
      return false;
    }

    this.eventos.splice(index, 1);
    return true;
  }

  // Adiciona um avaliador ao evento
  addAvaliador(eventoId, avaliadorId) {
    const evento = this.getById(eventoId);

    if (!evento) {
      return false;
    }

    // Verifica se o avaliador já está associado ao evento
    if (evento.avaliadores.includes(avaliadorId)) {
      return false;
    }

    evento.avaliadores.push(avaliadorId);
    evento.updatedAt = new Date();
    return true;
  }

  // Remove um avaliador do evento
  removeAvaliador(eventoId, avaliadorId) {
    const evento = this.getById(eventoId);

    if (!evento) {
      return false;
    }

    const index = evento.avaliadores.indexOf(avaliadorId);

    if (index === -1) {
      return false;
    }

    evento.avaliadores.splice(index, 1);
    evento.updatedAt = new Date();
    return true;
  }

  // Adiciona um artigo ao evento
  addArtigo(eventoId, artigoId) {
    const evento = this.getById(eventoId);

    if (!evento) {
      return false;
    }

    // Verifica se o artigo já está associado ao evento
    if (evento.artigos.includes(artigoId)) {
      return false;
    }

    evento.artigos.push(artigoId);
    evento.updatedAt = new Date();
    return true;
  }

  // Remove um artigo do evento
  removeArtigo(eventoId, artigoId) {
    const evento = this.getById(eventoId);

    if (!evento) {
      return false;
    }

    const index = evento.artigos.indexOf(artigoId);

    if (index === -1) {
      return false;
    }

    evento.artigos.splice(index, 1);
    evento.updatedAt = new Date();
    return true;
  }

  // Obtém eventos criados por um usuário
  getByCriador(criadorId) {
    return this.eventos.filter((evento) => evento.criadoPor === criadorId);
  }

  // Obtém eventos ativos (data atual entre início e fim)
  getEventosAtivos() {
    const hoje = new Date();

    return this.eventos.filter((evento) => {
      const dataInicio = new Date(evento.dataInicio);
      const dataFim = new Date(evento.dataFim);

      return hoje >= dataInicio && hoje <= dataFim;
    });
  }

  // Obtém eventos futuros (data atual antes do início)
  getEventosFuturos() {
    const hoje = new Date();

    return this.eventos.filter((evento) => {
      const dataInicio = new Date(evento.dataInicio);

      return hoje < dataInicio;
    });
  }

  // Obtém eventos passados (data atual após o fim)
  getEventosPassados() {
    const hoje = new Date();

    return this.eventos.filter((evento) => {
      const dataFim = new Date(evento.dataFim);

      return hoje > dataFim;
    });
  }
}

module.exports = new EventoService();
