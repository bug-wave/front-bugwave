"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EventItem {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  artigos: string[];
  numAvaliadores: number;
}

interface ArtigoItem {
  id: string;
  titulo: string;
  autores: string[];
  resumo: string;
  status: string;
  caminhoPDF: string;
}

const CoordenadorHomePage = () => {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventItem[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventItem | null>(
    null
  );
  const [artigosPorEvento, setArtigosPorEvento] = useState<ArtigoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalNovoEvento, setMostrarModalNovoEvento] = useState(false);

  // Função para formatar data
  const formatarData = (data: Date) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  // Carregar dados dos eventos
  useEffect(() => {
    const carregarEventos = async () => {
      try {
        // Em um ambiente real, usaríamos o serviço para buscar os dados
        const response = await fetch("/api/eventos");
        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        // Fallback para dados mockados em caso de erro
        setEventos([
          {
            id: "1",
            titulo: "Conferência Nacional de Tecnologia 2025",
            descricao:
              "Evento anual que reúne pesquisadores e profissionais da área de tecnologia.",
            dataInicio: new Date("2025-07-15"),
            dataFim: new Date("2025-07-20"),
            artigos: ["1", "2", "3"],
            numAvaliadores: 5,
          },
          {
            id: "2",
            titulo: "Simpósio de Sustentabilidade e Meio Ambiente",
            descricao:
              "Encontro para debater os avanços e desafios na área de sustentabilidade.",
            dataInicio: new Date("2025-09-05"),
            dataFim: new Date("2025-09-07"),
            artigos: ["4", "5"],
            numAvaliadores: 3,
          },
          {
            id: "3",
            titulo: "Workshop de Engenharia de Software",
            descricao:
              "Workshop prático sobre boas práticas e tendências em engenharia de software.",
            dataInicio: new Date("2025-11-10"),
            dataFim: new Date("2025-11-12"),
            artigos: ["6", "7", "8"],
            numAvaliadores: 4,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    carregarEventos();
  }, []);

  // Função para voltar à página principal
  const voltarParaPrincipal = () => {
    router.push("/");
  };

  // Buscar detalhes do evento
  const buscarDetalhesEvento = async (evento: EventItem) => {
    setLoading(true);
    setEventoSelecionado(evento);

    try {
      // Em um ambiente real, usaríamos o serviço para buscar os dados
      const response = await fetch(`/api/eventos/artigos/${evento.id}`);
      const data = await response.json();
      setArtigosPorEvento(data);
    } catch (error) {
      console.error("Erro ao carregar artigos do evento:", error);
      // Fallback para dados mockados em caso de erro
      setArtigosPorEvento(
        [
          {
            id: "1",
            titulo: "Inteligência Artificial na Medicina",
            autores: ["Maria Silva", "João Oliveira"],
            resumo: "Este artigo discute o impacto da IA na medicina moderna.",
            status: "APROVADO",
            caminhoPDF: "/uploads/artigos/artigo1.pdf",
          },
          {
            id: "2",
            titulo: "Energias Renováveis no Brasil",
            autores: ["Pedro Santos", "Ana Ferreira"],
            resumo:
              "Uma análise sobre o panorama das energias renováveis no Brasil.",
            status: "EM_AVALIACAO",
            caminhoPDF: "/uploads/artigos/artigo2.pdf",
          },
          {
            id: "3",
            titulo: "Big Data e Aprendizado de Máquina",
            autores: ["Carlos Mendes", "Lúcia Faria"],
            resumo:
              "Análise das aplicações de Big Data combinado com técnicas de Machine Learning.",
            status: "REPROVADO",
            caminhoPDF: "/uploads/artigos/artigo3.pdf",
          },
          {
            id: "4",
            titulo: "Impacto da Agricultura Digital",
            autores: ["Roberto Lima", "Fernanda Costa"],
            resumo:
              "Estudo sobre como a tecnologia está transformando a agricultura tradicional.",
            status: "APROVADO",
            caminhoPDF: "/uploads/artigos/artigo4.pdf",
          },
        ].filter((artigo) => evento.artigos.includes(artigo.id))
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um novo evento
  const criarNovoEvento = () => {
    router.push("/private/coordenador/novoEvento");
  };

  // Função para editar um evento existente
  const editarEvento = (id: string) => {
    router.push(`/private/coordenador/editarEvento?id=${id}`);
  };

  // Função para gerenciar avaliadores de um evento
  const gerenciarAvaliadores = (eventoId: string) => {
    router.push(`/private/coordenador/avaliadores?eventoId=${eventoId}`);
  };

  // Função para visualizar detalhes de um artigo
  const visualizarArtigo = (artigoId: string) => {
    router.push(`/private/coordenador/artigo?id=${artigoId}`);
  };

  // Função para voltar à lista de eventos
  const voltarParaEventos = () => {
    setEventoSelecionado(null);
    setArtigosPorEvento([]);
  };

  // Renderização condicional baseada no estado
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-[#304358] text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">BugWave - Portal do Coordenador</h1>
          <button
            onClick={voltarParaPrincipal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
          >
            <span className="mr-1">Voltar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : eventoSelecionado ? (
          // Visualização detalhada do evento selecionado
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#304358]">
                {eventoSelecionado.titulo} - Detalhes do Evento
              </h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => editarEvento(eventoSelecionado.id)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar Evento
                </button>
                <button
                  onClick={() => gerenciarAvaliadores(eventoSelecionado.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Gerenciar Avaliadores
                </button>
                <button
                  onClick={voltarParaEventos}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Voltar aos eventos
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{eventoSelecionado.descricao}</p>
              <p className="text-sm text-gray-600 mt-2">
                Período: {formatarData(eventoSelecionado.dataInicio)} a{" "}
                {formatarData(eventoSelecionado.dataFim)}
              </p>
              <p className="text-sm text-gray-600">
                Avaliadores alocados: {eventoSelecionado.numAvaliadores}
              </p>
              <p className="text-sm text-gray-600">
                Artigos submetidos: {eventoSelecionado.artigos?.length || 0}
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-[#304358]">
              Artigos Submetidos
            </h3>

            {artigosPorEvento.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Nenhum artigo submetido para este evento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artigosPorEvento.map((artigo) => (
                  <div
                    key={artigo.id}
                    onClick={() => visualizarArtigo(artigo.id)}
                    className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-lg p-3 mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1 text-gray-800">
                          {artigo.titulo}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {artigo.autores.join(", ")}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {artigo.resumo}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              artigo.status === "APROVADO"
                                ? "bg-green-100 text-green-800"
                                : artigo.status === "EM_AVALIACAO"
                                ? "bg-yellow-100 text-yellow-800"
                                : artigo.status === "REPROVADO"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {artigo.status === "APROVADO"
                              ? "Aprovado"
                              : artigo.status === "EM_AVALIACAO"
                              ? "Em avaliação"
                              : artigo.status === "REPROVADO"
                              ? "Reprovado"
                              : "Submetido"}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Visualizar Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Lista de eventos disponíveis para gerenciamento
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#304358]">
                Gestão de Eventos
              </h2>
              <button
                onClick={criarNovoEvento}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Novo Evento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
              {eventos.length === 0 ? (
                <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Nenhum evento cadastrado.</p>
                </div>
              ) : (
                eventos.map((evento) => (
                  <div
                    key={evento.id}
                    className="group bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 h-36 rounded-lg flex items-center justify-center overflow-hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-white opacity-80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {evento.titulo}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {evento.descricao}
                    </p>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {formatarData(evento.dataInicio)} -{" "}
                          {formatarData(evento.dataFim)}
                        </span>
                      </div>
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>
                          {evento.artigos?.length || 0} artigos submetidos
                        </span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{evento.numAvaliadores} avaliadores</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <button
                        onClick={() => buscarDetalhesEvento(evento)}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                      >
                        <span>Ver detalhes</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            editarEvento(evento.id);
                          }}
                          className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            gerenciarAvaliadores(evento.id);
                          }}
                          className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#304358] text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 BugWave - Sistema de Gestão Acadêmica</p>
        </div>
      </footer>
    </div>
  );
};

export default CoordenadorHomePage;
