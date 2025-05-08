// Dados mocados para Artigos
const artigosMock = [
  {
    id: "1",
    titulo: "Inteligência Artificial na Medicina",
    autores: ["Maria Silva", "João Oliveira"],
    palavrasChave: ["IA", "Medicina", "Saúde"],
    resumo: "Este artigo discute o impacto da IA na medicina moderna.",
    areaTematica: "Tecnologia na Saúde",
    caminhoPDF: "/uploads/artigos/artigo1.pdf",
    autor: "1", // ID do usuário
    comentarios: ["1", "2"], // IDs dos comentários
    avaliacoes: ["1"], // IDs das avaliações
    status: "EM_AVALIACAO",
    createdAt: new Date("2025-04-15"),
    updatedAt: new Date("2025-04-15"),
  },
  {
    id: "2",
    titulo: "Energias Renováveis no Brasil",
    autores: ["Pedro Santos", "Ana Ferreira"],
    palavrasChave: ["Energia Solar", "Sustentabilidade", "Brasil"],
    resumo: "Uma análise sobre o panorama das energias renováveis no Brasil.",
    areaTematica: "Energia e Sustentabilidade",
    caminhoPDF: "/uploads/artigos/artigo2.pdf",
    autor: "2", // ID do usuário
    comentarios: ["3"], // IDs dos comentários
    avaliacoes: ["2"], // IDs das avaliações
    status: "APROVADO",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-04-20"),
  },
  {
    id: "3",
    titulo: "Arquitetura de Software: Microserviços vs Monolítico",
    autores: ["Lucas Mendes"],
    palavrasChave: ["Arquitetura", "Microserviços", "Desenvolvimento"],
    resumo:
      "Comparação entre arquiteturas de software monolíticas e baseadas em microserviços.",
    areaTematica: "Engenharia de Software",
    caminhoPDF: "/uploads/artigos/artigo3.pdf",
    autor: "3", // ID do usuário
    comentarios: [], // Sem comentários ainda
    avaliacoes: [], // Sem avaliações ainda
    status: "EM_CONFIRMACAO",
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-01"),
  },
];

module.exports = artigosMock;
