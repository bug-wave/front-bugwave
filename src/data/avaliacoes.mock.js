// Dados mocados para Avaliações
const avaliacoesMock = [
  {
    id: "1",
    avaliador: "4", // ID do usuário avaliador
    nota: 8.5,
    parecer:
      "Artigo bem fundamentado, com pesquisa relevante. Faltou um pouco mais de profundidade na análise dos resultados.",
    dataAvaliacao: new Date("2025-04-20"),
  },
  {
    id: "2",
    avaliador: "5", // ID do usuário avaliador
    nota: 9.0,
    parecer:
      "Excelente abordagem metodológica. A contribuição é significativa para a área.",
    dataAvaliacao: new Date("2025-04-25"),
  },
  {
    id: "3",
    avaliador: "4", // ID do usuário avaliador
    nota: 7.0,
    parecer:
      "O trabalho apresenta boas ideias, mas precisa aprofundar melhor a fundamentação teórica.",
    dataAvaliacao: new Date("2025-05-02"),
  },
];

module.exports = avaliacoesMock;
