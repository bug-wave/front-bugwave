// Serviço para entidade Comentário
const comentariosMock = require("../data/comentarios.mock");

class ComentarioService {
  constructor() {
    this.comentarios = comentariosMock;
  }

  // Obtém todos os comentários
  getAll() {
    return this.comentarios;
  }

  // Obtém um comentário pelo ID
  getById(id) {
    return this.comentarios.find((comentario) => comentario.id === id);
  }

  // Adiciona um novo comentário
  create(comentarioData) {
    const novoComentario = {
      ...comentarioData,
      id: (this.comentarios.length + 1).toString(),
      criadoEm: new Date(),
    };

    this.comentarios.push(novoComentario);
    return novoComentario;
  }

  // Atualiza um comentário existente
  update(id, comentarioData) {
    const index = this.comentarios.findIndex(
      (comentario) => comentario.id === id
    );

    if (index === -1) {
      return null;
    }

    const comentarioAtualizado = {
      ...this.comentarios[index],
      ...comentarioData,
      // Mantém a data original de criação
      criadoEm: this.comentarios[index].criadoEm,
    };

    this.comentarios[index] = comentarioAtualizado;
    return comentarioAtualizado;
  }

  // Remove um comentário
  delete(id) {
    const index = this.comentarios.findIndex(
      (comentario) => comentario.id === id
    );

    if (index === -1) {
      return false;
    }

    this.comentarios.splice(index, 1);
    return true;
  }

  // Obtém comentários por autor
  getByAutor(autorId) {
    return this.comentarios.filter(
      (comentario) => comentario.autor === autorId
    );
  }

  // Busca comentários por parte do texto
  searchByText(textoParcial) {
    if (!textoParcial) {
      return [];
    }

    return this.comentarios.filter((comentario) =>
      comentario.texto.toLowerCase().includes(textoParcial.toLowerCase())
    );
  }

  // Obtém comentários por IDs
  getByIds(ids) {
    return this.comentarios.filter((comentario) => ids.includes(comentario.id));
  }
}

module.exports = new ComentarioService();
