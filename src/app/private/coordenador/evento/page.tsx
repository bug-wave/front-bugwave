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
  avaliadores: string[];
  criadoPor: string;
}

const GestaoEventosPage = () => {
  const router = useRouter();
  const [eventos, setEventos] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [eventoAtual, setEventoAtual] = useState<EventItem | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  });
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(
    null
  );

  // Função para formatar data para exibição
  const formatarData = (data: Date) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para formatar data para input type="date"
  const formatarDataParaInput = (data: Date) => {
    if (!data) return "";
    const date = new Date(data);
    return date.toISOString().split("T")[0];
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
            avaliadores: ["1", "2"],
            criadoPor: "1",
          },
          {
            id: "2",
            titulo: "Simpósio de Sustentabilidade e Meio Ambiente",
            descricao:
              "Encontro para debater os avanços e desafios na área de sustentabilidade.",
            dataInicio: new Date("2025-09-05"),
            dataFim: new Date("2025-09-07"),
            artigos: ["4", "5"],
            avaliadores: ["3", "4"],
            criadoPor: "1",
          },
          {
            id: "3",
            titulo: "Workshop de Engenharia de Software",
            descricao:
              "Workshop prático sobre boas práticas e tendências em engenharia de software.",
            dataInicio: new Date("2025-11-10"),
            dataFim: new Date("2025-11-12"),
            artigos: ["6", "7", "8"],
            avaliadores: ["2", "5"],
            criadoPor: "2",
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

  // Funções para gerenciar o modal
  const abrirModalCriacao = () => {
    setFormData({
      titulo: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
    });
    setModoEdicao(false);
    setModalAberto(true);
  };

  const abrirModalEdicao = (evento: EventItem) => {
    setEventoAtual(evento);
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataInicio: formatarDataParaInput(evento.dataInicio),
      dataFim: formatarDataParaInput(evento.dataFim),
    });
    setModoEdicao(true);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setEventoAtual(null);
  };

  // Funções para gerenciar formulário
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modoEdicao && eventoAtual) {
        // Atualizar evento existente
        const eventoAtualizado = {
          ...eventoAtual,
          titulo: formData.titulo,
          descricao: formData.descricao,
          dataInicio: new Date(formData.dataInicio),
          dataFim: new Date(formData.dataFim),
        };

        // Em um ambiente real, faríamos uma requisição PUT para atualizar o evento
        // await fetch(`/api/eventos/${eventoAtual.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(eventoAtualizado)
        // });

        // Atualizando o estado local
        setEventos(
          eventos.map((ev) =>
            ev.id === eventoAtual.id ? eventoAtualizado : ev
          )
        );
      } else {
        // Criar novo evento
        const novoEvento = {
          id: (eventos.length + 1).toString(),
          titulo: formData.titulo,
          descricao: formData.descricao,
          dataInicio: new Date(formData.dataInicio),
          dataFim: new Date(formData.dataFim),
          artigos: [],
          avaliadores: [],
          criadoPor: "1", // Normalmente seria o ID do usuário logado
        };

        // Em um ambiente real, faríamos uma requisição POST para criar o evento
        // await fetch('/api/eventos', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(novoEvento)
        // });

        // Atualizando o estado local
        setEventos([...eventos, novoEvento]);
      }

      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para confirmar exclusão
  const iniciarExclusao = (id: string) => {
    setConfirmarExclusao(id);
  };

  const cancelarExclusao = () => {
    setConfirmarExclusao(null);
  };

  const confirmarExclusaoEvento = async (id: string) => {
    setLoading(true);
    try {
      // Em um ambiente real, faríamos uma requisição DELETE
      // await fetch(`/api/eventos/${id}`, { method: 'DELETE' });

      // Atualizando o estado local
      setEventos(eventos.filter((evento) => evento.id !== id));
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
    } finally {
      setConfirmarExclusao(null);
      setLoading(false);
    }
  };

  // Função para gerenciar avaliadores de um evento
  const gerenciarAvaliadores = (eventoId: string) => {
    router.push(`/private/coordenador/avaliadores?eventoId=${eventoId}`);
  };

  // Função para visualizar artigos de um evento
  const visualizarArtigos = (eventoId: string) => {
    router.push(`/private/coordenador/artigos?eventoId=${eventoId}`);
  };

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
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#304358]">
                Gestão de Eventos
              </h2>
              <button
                onClick={abrirModalCriacao}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Evento
              </button>
            </div>

            {eventos.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
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
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-500">
                  Clique em Novo Evento para criar seu primeiro evento
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                {eventos.map((evento) => (
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
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      {evento.titulo}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {evento.descricao}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatarData(evento.dataInicio)} a{" "}
                        {formatarData(evento.dataFim)}
                      </div>
                      <div className="flex items-center">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Artigos: {evento.artigos?.length || 0}
                      </div>
                      <div className="flex items-center">
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
                        Avaliadores: {evento.avaliadores?.length || 0}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => abrirModalEdicao(evento)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
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
                        Editar
                      </button>
                      <div className="relative">
                        {confirmarExclusao === evento.id ? (
                          <div className="absolute inset-0 bg-white rounded-lg z-10">
                            <div className="flex h-full">
                              <button
                                onClick={() =>
                                  confirmarExclusaoEvento(evento.id)
                                }
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-l-lg transition duration-200 flex items-center justify-center text-sm"
                              >
                                Sim
                              </button>
                              <button
                                onClick={cancelarExclusao}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-r-lg transition duration-200 flex items-center justify-center text-sm"
                              >
                                Não
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => iniciarExclusao(evento.id)}
                            className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => visualizarArtigos(evento.id)}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="text-sm">Artigos</span>
                      </button>
                      <button
                        onClick={() => gerenciarAvaliadores(evento.id)}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center"
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
                        <span className="text-sm">Avaliadores</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal para criar/editar evento */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {modoEdicao ? "Editar Evento" : "Criar Novo Evento"}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título do Evento
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o título do evento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a descrição do evento"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Término
                    </label>
                    <input
                      type="date"
                      name="dataFim"
                      value={formData.dataFim}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end gap-4">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
                >
                  {modoEdicao ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#304358] text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 BugWave - Sistema de Gestão Acadêmica</p>
        </div>
      </footer>
    </div>
  );
};

export default GestaoEventosPage;
