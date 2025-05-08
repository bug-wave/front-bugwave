// Serviço para entidade Artigo
const artigosMock = require("../data/artigos.mock");

class ArtigoService {
  constructor() {
    this.artigos = artigosMock;
  }

  // Obtém todos os artigos
  getAll() {
    return this.artigos;
  }

  // Obtém um artigo pelo ID
  getById(id) {
    return this.artigos.find((artigo) => artigo.id === id);
  }

  // Adiciona um novo artigo
  create(artigoData) {
    const novoArtigo = {
      ...artigoData,
      id: (this.artigos.length + 1).toString(),
      comentarios: [],
      avaliacoes: [],
      status: "EM_CONFIRMACAO",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.artigos.push(novoArtigo);
    return novoArtigo;
  }

  // Atualiza um artigo existente
  update(id, artigoData) {
    const index = this.artigos.findIndex((artigo) => artigo.id === id);

    if (index === -1) {
      return null;
    }

    const artigoAtualizado = {
      ...this.artigos[index],
      ...artigoData,
      updatedAt: new Date(),
    };

    this.artigos[index] = artigoAtualizado;
    return artigoAtualizado;
  }

  // Remove um artigo
  delete(id) {
    const index = this.artigos.findIndex((artigo) => artigo.id === id);

    if (index === -1) {
      return false;
    }

    this.artigos.splice(index, 1);
    return true;
  }

  // Adiciona um comentário ao artigo
  addComentario(artigoId, comentarioId) {
    const artigo = this.getById(artigoId);

    if (!artigo) {
      return false;
    }

    artigo.comentarios.push(comentarioId);
    artigo.updatedAt = new Date();
    return true;
  }

  // Adiciona uma avaliação ao artigo
  addAvaliacao(artigoId, avaliacaoId) {
    const artigo = this.getById(artigoId);

    if (!artigo) {
      return false;
    }

    artigo.avaliacoes.push(avaliacaoId);
    artigo.updatedAt = new Date();
    return true;
  }

  // Atualiza o status de um artigo
  updateStatus(id, status) {
    const artigo = this.getById(id);

    if (!artigo) {
      return null;
    }

    artigo.status = status;
    artigo.updatedAt = new Date();
    return artigo;
  }

  // Obtém artigos por autor
  getByAutor(autorId) {
    return this.artigos.filter((artigo) => artigo.autor === autorId);
  }

  // Obtém artigos por status
  getByStatus(status) {
    return this.artigos.filter((artigo) => artigo.status === status);
  }
}

module.exports = new ArtigoService();
