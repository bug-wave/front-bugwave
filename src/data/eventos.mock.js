// Dados mocados para Eventos
const eventosMock = [
  {
    id: "1",
    titulo: "Conferência Nacional de Tecnologia 2025",
    descricao:
      "Evento anual que reúne pesquisadores e profissionais da área de tecnologia.",
    numeroAvaliadores: 3,
    avaliadores: ["4", "5", "6"], // IDs dos usuários avaliadores
    dataInicio: new Date("2025-07-15"),
    dataFim: new Date("2025-07-20"),
    criadoPor: "7", // ID do usuário coordenador
    artigos: ["1", "2"], // IDs dos artigos
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "2",
    titulo: "Simpósio de Sustentabilidade e Meio Ambiente",
    descricao:
      "Encontro para debater os avanços e desafios na área de sustentabilidade.",
    numeroAvaliadores: 2,
    avaliadores: ["4", "8"], // IDs dos usuários avaliadores
    dataInicio: new Date("2025-09-05"),
    dataFim: new Date("2025-09-07"),
    criadoPor: "7", // ID do usuário coordenador
    artigos: ["2"], // IDs dos artigos
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-02-15"),
  },
  {
    id: "3",
    titulo: "Workshop de Engenharia de Software",
    descricao:
      "Workshop prático sobre boas práticas e tendências em engenharia de software.",
    numeroAvaliadores: 2,
    avaliadores: ["5", "8"], // IDs dos usuários avaliadores
    dataInicio: new Date("2025-11-10"),
    dataFim: new Date("2025-11-12"),
    criadoPor: "9", // ID do usuário coordenador
    artigos: ["3"], // IDs dos artigos
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-03-20"),
  },
];

module.exports = eventosMock;
