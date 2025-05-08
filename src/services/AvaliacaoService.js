// Serviço para entidade Avaliação
const avaliacoesMock = require("../data/avaliacoes.mock");

class AvaliacaoService {
  constructor() {
    this.avaliacoes = avaliacoesMock;
  }

  // Obtém todas as avaliações
  getAll() {
    return this.avaliacoes;
  }

  // Obtém uma avaliação pelo ID
  getById(id) {
    return this.avaliacoes.find((avaliacao) => avaliacao.id === id);
  }

  // Adiciona uma nova avaliação
  create(avaliacaoData) {
    const novaAvaliacao = {
      ...avaliacaoData,
      id: (this.avaliacoes.length + 1).toString(),
      dataAvaliacao: new Date(),
    };

    this.avaliacoes.push(novaAvaliacao);
    return novaAvaliacao;
  }

  // Atualiza uma avaliação existente
  update(id, avaliacaoData) {
    const index = this.avaliacoes.findIndex((avaliacao) => avaliacao.id === id);

    if (index === -1) {
      return null;
    }

    const avaliacaoAtualizada = {
      ...this.avaliacoes[index],
      ...avaliacaoData,
      dataAvaliacao: new Date(),
    };

    this.avaliacoes[index] = avaliacaoAtualizada;
    return avaliacaoAtualizada;
  }

  // Remove uma avaliação
  delete(id) {
    const index = this.avaliacoes.findIndex((avaliacao) => avaliacao.id === id);

    if (index === -1) {
      return false;
    }

    this.avaliacoes.splice(index, 1);
    return true;
  }

  // Obtém avaliações por avaliador
  getByAvaliador(avaliadorId) {
    return this.avaliacoes.filter(
      (avaliacao) => avaliacao.avaliador === avaliadorId
    );
  }

  // Obtém avaliações com nota acima de um valor
  getByNotaMinima(notaMinima) {
    return this.avaliacoes.filter((avaliacao) => avaliacao.nota >= notaMinima);
  }

  // Calcula média de notas
  calcularMediaNotas(avaliacoesIds) {
    if (!avaliacoesIds || avaliacoesIds.length === 0) {
      return 0;
    }

    const avaliacoesValidas = this.avaliacoes.filter((avaliacao) =>
      avaliacoesIds.includes(avaliacao.id)
    );

    if (avaliacoesValidas.length === 0) {
      return 0;
    }

    const somaNotas = avaliacoesValidas.reduce(
      (soma, avaliacao) => soma + avaliacao.nota,
      0
    );
    return somaNotas / avaliacoesValidas.length;
  }
}

module.exports = new AvaliacaoService();
