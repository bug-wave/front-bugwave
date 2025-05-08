"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaFilePdf,
  FaEye,
  FaCommentAlt,
  FaCalendarAlt,
  FaCheck,
  FaHistory,
  FaExclamationTriangle,
  FaSearch,
  FaFilter,
  FaUserEdit,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";

interface ArtigoItem {
  id: string;
  titulo: string;
  autores: string[];
  resumo: string;
  status: string;
  caminhoPDF: string;
  eventoId: string;
  dataEnvio?: string;
  totalComentarios?: number;
}

const ArtigosEventoPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventoId = searchParams.get("eventoId");

  const [loading, setLoading] = useState(true);
  const [artigos, setArtigos] = useState<ArtigoItem[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [termoBusca, setTermoBusca] = useState("");
  const [infoEvento, setInfoEvento] = useState({
    titulo: "",
    descricao: "",
    dataInicio: new Date(),
    dataFim: new Date(),
  });

  // Função para formatar data
  const formatarData = (data: Date) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  // Carregar dados do evento e seus artigos
  useEffect(() => {
    const carregarDados = async () => {
      if (!eventoId) {
        router.push("/private/coordenador/home");
        return;
      }

      try {
        // Carregar informações do evento
        const eventoResponse = await fetch(`/api/eventos/${eventoId}`);
        const eventoData = await eventoResponse.json();
        setInfoEvento({
          titulo: eventoData.titulo,
          descricao: eventoData.descricao,
          dataInicio: new Date(eventoData.dataInicio),
          dataFim: new Date(eventoData.dataFim),
        });

        // Carregar artigos do evento
        const artigosResponse = await fetch(`/api/eventos/${eventoId}/artigos`);
        const artigosData = await artigosResponse.json();
        setArtigos(artigosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        // Dados mockados para desenvolvimento
        setInfoEvento({
          titulo: "Conferência Nacional de Tecnologia 2025",
          descricao:
            "Evento anual que reúne pesquisadores e profissionais da área de tecnologia.",
          dataInicio: new Date("2025-07-15"),
          dataFim: new Date("2025-07-20"),
        });

        setArtigos([
          {
            id: "1",
            titulo: "Inteligência Artificial na Medicina",
            autores: ["Maria Silva", "João Oliveira"],
            resumo: "Este artigo discute o impacto da IA na medicina moderna.",
            status: "APROVADO",
            caminhoPDF: "/uploads/artigos/artigo1.pdf",
            eventoId: eventoId || "1",
            dataEnvio: "15/04/2025",
            totalComentarios: 4,
          },
          {
            id: "2",
            titulo: "Energias Renováveis no Brasil",
            autores: ["Pedro Santos", "Ana Ferreira"],
            resumo:
              "Uma análise sobre o panorama das energias renováveis no Brasil.",
            status: "EM_AVALIACAO",
            caminhoPDF: "/uploads/artigos/artigo2.pdf",
            eventoId: eventoId || "1",
            dataEnvio: "20/03/2025",
            totalComentarios: 2,
          },
          {
            id: "3",
            titulo: "Big Data e Aprendizado de Máquina",
            autores: ["Carlos Mendes", "Lúcia Faria"],
            resumo:
              "Análise das aplicações de Big Data combinado com técnicas de Machine Learning.",
            status: "REPROVADO",
            caminhoPDF: "/uploads/artigos/artigo3.pdf",
            eventoId: eventoId || "1",
            dataEnvio: "10/04/2025",
            totalComentarios: 7,
          },
          {
            id: "4",
            titulo: "Impacto da Agricultura Digital",
            autores: ["Roberto Lima", "Fernanda Costa"],
            resumo:
              "Estudo sobre como a tecnologia está transformando a agricultura tradicional.",
            status: "REVISAO_SOLICITADA",
            caminhoPDF: "/uploads/artigos/artigo4.pdf",
            eventoId: eventoId || "1",
            dataEnvio: "05/05/2025",
            totalComentarios: 3,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [eventoId, router]);

  // Função para voltar para a página de eventos
  const voltarParaEventos = () => {
    router.push("/private/coordenador/evento");
  };

  // Função para visualizar detalhes de um artigo
  const visualizarArtigo = (artigoId: string) => {
    router.push(`/private/coordenador/artigo-detalhes?id=${artigoId}`);
  };

  // Função para filtrar artigos com base no status e termo de busca
  const artigosFiltrados = artigos.filter((artigo) => {
    const matchStatus = filtroStatus ? artigo.status === filtroStatus : true;
    const matchTermo = termoBusca
      ? artigo.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        artigo.autores.some((autor) =>
          autor.toLowerCase().includes(termoBusca.toLowerCase())
        ) ||
        artigo.resumo.toLowerCase().includes(termoBusca.toLowerCase())
      : true;

    return matchStatus && matchTermo;
  });

  // Função que retorna informações de status do artigo (ícone, cor, texto)
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "APROVADO":
        return {
          class: "bg-green-50 text-green-800 border-green-200",
          icon: <FaCheck className="text-green-500" />,
          text: "Aprovado",
        };
      case "REPROVADO":
        return {
          class: "bg-red-50 text-red-800 border-red-200",
          icon: <FaExclamationTriangle className="text-red-500" />,
          text: "Reprovado",
        };
      case "EM_AVALIACAO":
        return {
          class: "bg-blue-50 text-blue-800 border-blue-200",
          icon: <FaHistory className="text-blue-500 animate-spin-slow" />,
          text: "Em Avaliação",
        };
      case "REVISAO_SOLICITADA":
        return {
          class: "bg-yellow-50 text-yellow-800 border-yellow-200",
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          text: "Revisão Solicitada",
        };
      case "PENDENTE":
        return {
          class: "bg-gray-50 text-gray-800 border-gray-200",
          icon: <FaHistory className="text-gray-500" />,
          text: "Pendente",
        };
      default:
        return {
          class: "bg-gray-50 text-gray-800 border-gray-200",
          icon: <FaHistory className="text-gray-500" />,
          text: status,
        };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-[#304358] text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">BugWave - Portal do Coordenador</h1>
          <button
            onClick={voltarParaEventos}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            <span>Voltar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="p-8 rounded-lg shadow-lg bg-white">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#304358]"></div>
                <p className="mt-4 text-lg font-medium text-[#304358]">
                  Carregando artigos...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#304358] mb-2">
                    {infoEvento.titulo}
                  </h2>
                  <p className="text-gray-600 mb-2">{infoEvento.descricao}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      Período: {formatarData(infoEvento.dataInicio)} a{" "}
                      {formatarData(infoEvento.dataFim)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h3 className="text-xl font-bold text-[#304358] mb-2 md:mb-0">
                  Artigos Submetidos
                </h3>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar artigos..."
                      value={termoBusca}
                      onChange={(e) => setTermoBusca(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="relative">
                    <select
                      className="pl-10 pr-4 py-2 w-full md:w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      value={filtroStatus}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="APROVADO">Aprovados</option>
                      <option value="REPROVADO">Reprovados</option>
                      <option value="EM_AVALIACAO">Em avaliação</option>
                      <option value="REVISAO_SOLICITADA">
                        Revisão solicitada
                      </option>
                      <option value="PENDENTE">Pendentes</option>
                    </select>
                    <FaFilter className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {artigosFiltrados.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <FaFilePdf className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    Nenhum artigo encontrado
                  </h3>
                  <p className="text-gray-500">
                    {filtroStatus || termoBusca
                      ? "Nenhum artigo corresponde aos critérios de busca."
                      : "Não há artigos submetidos para este evento."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artigosFiltrados.map((artigo) => {
                    const statusInfo = getStatusInfo(artigo.status);

                    return (
                      <div
                        key={artigo.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100 overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-start">
                            <div className="bg-[#304358] p-3 rounded-md text-white mr-4">
                              <FaFilePdf className="text-xl" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-xl text-gray-800 line-clamp-2 mb-2">
                                {artigo.titulo}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {artigo.autores.join(", ")}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                {artigo.dataEnvio && (
                                  <>
                                    <FaCalendarAlt className="mr-1" />
                                    <span>{artigo.dataEnvio}</span>
                                    <span className="mx-2">•</span>
                                  </>
                                )}
                                <div className="flex items-center">
                                  <FaCommentAlt className="mr-1" />
                                  <span>
                                    {artigo.totalComentarios || 0} comentários
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm line-clamp-2 mt-3">
                            {artigo.resumo}
                          </p>

                          <div
                            className={`flex items-center p-2 rounded-md border ${statusInfo.class} mt-4 mb-4`}
                          >
                            {statusInfo.icon}
                            <span className="ml-2 font-medium">
                              {statusInfo.text}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => visualizarArtigo(artigo.id)}
                              className="px-3 py-2 bg-[#304358] text-white font-medium rounded-md hover:bg-opacity-90 transition-colors duration-200 flex items-center text-sm"
                            >
                              <FaEye className="mr-2" />
                              Visualizar Detalhes
                            </button>

                            <button
                              className="px-3 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(artigo.caminhoPDF, "_blank");
                              }}
                            >
                              <FaDownload className="mr-2" />
                              PDF
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#304358] text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 BugWave - Sistema de Gestão Acadêmica</p>
        </div>
      </footer>
    </div>
  );
};

export default ArtigosEventoPage;
