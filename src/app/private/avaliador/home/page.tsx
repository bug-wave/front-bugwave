"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventoService, ArtigoService, Evento, Artigo } from "@/services/api";

interface EventItem extends Evento {
  artigos: string[];
}

interface ArtigoItem extends Artigo {}

const AvaliadoresHomePage = () => {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventItem[]>([]);
  const [artigosPorEvento, setArtigosPorEvento] = useState<ArtigoItem[]>([]);
  const [eventoSelecionado, setEventoSelecionado] = useState<EventItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar data
  const formatarData = (data: string) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  // Carregar dados dos eventos
  useEffect(() => {
    const carregarEventos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Usa o serviço de API para buscar eventos ativos
        const response = await EventoService.getAtivos();

        if (!response.success) {
          throw new Error(response.error || "Erro ao carregar eventos");
        }

        setEventos(response.data || []);
      } catch (error: any) {
        console.error("Erro ao carregar eventos para avaliação:", error);
        setError(error.message || "Ocorreu um erro ao carregar os eventos");
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

  // Função para buscar artigos de um evento específico
  const buscarArtigosPorEvento = async (evento: EventItem) => {
    setLoading(true);
    setEventoSelecionado(evento);
    setError(null);
    console.log(evento)

    try {
      // Aqui estamos recuperando todos os artigos associados ao evento
      // Na prática, deveria haver um endpoint específico para listar artigos por evento para avaliação
      // Isso teria que ser implementado no backend

      if (!evento.artigos || evento.artigos.length === 0) {
        setArtigosPorEvento([]);
        return;
      }

      // Recuperando cada artigo individualmente
      const artigosPromises = evento.artigos.map((id) =>
        ArtigoService.getById(id)
      );
      const resultados = await Promise.all(artigosPromises);

      // Filtra apenas os resultados bem sucedidos e mapeia para seus dados
      const artigosFiltrados = resultados
        .filter((res) => res.success && res.data)
        .map((res) => res.data as ArtigoItem)
        // Filtra apenas artigos que estejam com status para avaliação
        .filter((artigo) =>
          ["PARA_AVALIAR", "EM_AVALIACAO", "EM_CONFIRMACAO"].includes(artigo.status)
        );
      
      setArtigosPorEvento(artigosFiltrados);
    } catch (error: any) {
      console.error("Erro ao carregar artigos para avaliação:", error);
      setError(error.message || "Erro ao buscar artigos para avaliação");
    } finally {
      setLoading(false);
    }
  };

  // Função para avaliar um artigo específico
  const avaliarArtigo = (artigo: ArtigoItem) => {
    // Redirecionar para a página de avaliação do artigo
    router.push(`/private/avaliador/artigoAluno?id=${artigo._id}`);
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
          <h1 className="text-xl font-bold">BugWave - Portal do Avaliador</h1>
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
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center py-8">
              <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Erro ao carregar dados
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : eventoSelecionado ? (
          // Visualização de artigos do evento selecionado para avaliação
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#304358]">
                {eventoSelecionado.titulo} - Artigos para Avaliação
              </h2>
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

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{eventoSelecionado.descricao}</p>
              <p className="text-sm text-gray-600 mt-2">
                Período: {formatarData(eventoSelecionado.dataInicio)} a{" "}
                {formatarData(eventoSelecionado.dataFim)}
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-[#304358]">
              Artigos Para Avaliação
            </h3>

            {artigosPorEvento.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  Nenhum artigo disponível para avaliação neste evento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {artigosPorEvento.map((artigo, index) => (
                  <div
                    key={index}
                    onClick={() => avaliarArtigo(artigo)}
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
                          {artigo.autores?.join(", ")}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {artigo.resumo}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              artigo.status === "AVALIADO"
                                ? "bg-green-100 text-green-800"
                                : artigo.status === "EM_AVALIACAO"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {artigo.status === "AVALIADO"
                              ? "Avaliado"
                              : artigo.status === "EM_AVALIACAO"
                              ? "Em avaliação"
                              : "Para avaliar"}
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Avaliar Artigo
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
          // Lista de eventos disponíveis para avaliação
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#304358]">
                Eventos Disponíveis para Avaliação
              </h2>
            </div>

            {eventos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhum evento disponível
                </h3>
                <p className="text-gray-600">
                  No momento não há eventos disponíveis para avaliação.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                {eventos.map((evento, index) => (
                  <div
                    key={index}
                    onClick={() => buscarArtigosPorEvento(evento)}
                    className="group bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1"
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>
                          {evento.artigos?.length || 0} artigos para avaliar
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center group">
                        <span>Ver artigos para avaliação</span>
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
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export default AvaliadoresHomePage;
