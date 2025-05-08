"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import StarRating from "@/components/starRating/StarRating";
import CommentViewer from "@/components/commentViewer/CommentViewer";
import ButtonComent from "@/components/buttonComent/ButtonComent";
import {
  ArtigoService,
  AvaliacaoService,
  ComentarioService,
  Artigo,
  Comentario,
} from "@/services/api";

const ArtigoAlunoPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const artigoId = searchParams.get("id") || "";

  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avaliacao, setAvaliacao] = useState<number>(0);
  const [comentarioTexto, setComentarioTexto] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [sucessoSubmissao, setSucessoSubmissao] = useState(false);

  // Voltar para a página anterior
  const voltarParaArtigos = () => {
    router.push("/private/avaliador/home");
  };

  // Carregar dados do artigo e comentários
  useEffect(() => {
    if (!artigoId) {
      setError("ID do artigo não fornecido");
      setLoading(false);
      return;
    }

    const carregarDados = async () => {
      setLoading(true);
      setError(null);

      try {
        // Carregar o artigo
        const artigoResponse = await ArtigoService.getById(artigoId);

        if (!artigoResponse.success || !artigoResponse.data) {
          throw new Error("Erro ao carregar o artigo");
        }

        setArtigo(artigoResponse.data);

        // Carregar comentários do artigo
        const comentariosResponse = await ComentarioService.getByArtigoId(
          artigoId
        );

        if (comentariosResponse.success && comentariosResponse.data) {
          setComentarios(comentariosResponse.data);
        }
      } catch (error: any) {
        console.error("Erro ao carregar dados do artigo:", error);
        setError(error.message || "Erro ao carregar dados do artigo");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [artigoId]);

  // Função para lidar com a mudança da nota
  const handleRatingChange = (rating: number) => {
    setAvaliacao(rating);
  };

  // Função para lidar com a mudança do texto do comentário
  const handleComentarioChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComentarioTexto(event.target.value);
  };

  // Função para adicionar um novo comentário
  const adicionarComentario = async (posicaoX: number, posicaoY: number) => {
    if (!comentarioTexto.trim()) {
      alert("Por favor, digite um comentário");
      return;
    }

    if (!artigo) {
      return;
    }

    try {
      setSubmitting(true);

      // Obter ID do usuário avaliador do localStorage ou estado global
      const avaliadorId = localStorage.getItem("userId") || "";

      if (!avaliadorId) {
        throw new Error("Usuário não identificado");
      }

      // Criar o comentário na API
      const novoComentario: Partial<Comentario> = {
        texto: comentarioTexto,
        posicaoX,
        posicaoY,
        artigoId: artigo.id,
        autorId: avaliadorId,
      };

      const response = await ComentarioService.create(novoComentario);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Erro ao criar comentário");
      }

      // Adicionar o comentário à lista local
      setComentarios([...comentarios, response.data]);
      setComentarioTexto("");
    } catch (error: any) {
      console.error("Erro ao adicionar comentário:", error);
      alert(`Erro ao adicionar comentário: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Função para enviar avaliação final
  const enviarAvaliacao = async () => {
    if (avaliacao === 0) {
      alert("Por favor, selecione uma nota para a avaliação");
      return;
    }

    if (!artigo) {
      return;
    }

    try {
      setSubmitting(true);

      // Obter ID do usuário avaliador do localStorage ou estado global
      const avaliadorId = localStorage.getItem("userId") || "";

      if (!avaliadorId) {
        throw new Error("Usuário não identificado");
      }

      // Criar a avaliação na API
      const avaliacaoObj = {
        artigoId: artigo.id,
        nota: avaliacao,
        avaliadorId,
        comentarios: `Total de ${comentarios.length} comentários`,
        isFinal: true,
      };

      const response = await AvaliacaoService.create(avaliacaoObj);

      if (!response.success) {
        throw new Error(response.error || "Erro ao enviar avaliação");
      }

      setSucessoSubmissao(true);

      // Redirecionar após um breve período
      setTimeout(() => {
        voltarParaArtigos();
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      alert(`Erro ao enviar avaliação: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Renderização condicional baseada no estado
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#304358]"></div>
      </div>
    );
  }

  if (error || !artigo) {
    return (
      <div className="bg-white min-h-screen flex flex-col p-8">
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 text-center mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">Erro</h2>
          <p className="text-red-600">
            {error || "Não foi possível carregar o artigo"}
          </p>
          <button
            onClick={voltarParaArtigos}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 flex items-center mx-auto"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
        </div>
      </div>
    );
  }

  if (sucessoSubmissao) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8">
        <div className="bg-green-50 p-8 rounded-lg border border-green-100 text-center max-w-md">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Avaliação enviada com sucesso!
          </h2>
          <p className="text-green-700 mb-6">
            Sua avaliação foi registrada. Você será redirecionado em
            instantes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#304358] text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={voltarParaArtigos}
              className="mr-4 p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-xl font-bold">Avaliação de Artigo</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Informações do Artigo */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#304358] mb-1">
              {artigo.titulo}
            </h2>
            <p className="text-gray-600 mb-4">
              Autores: {artigo.autores?.join(", ")}
            </p>
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-[#304358] mb-2">
                Resumo
              </h3>
              <p className="text-gray-700">{artigo.resumo}</p>
            </div>
          </div>

          {/* Visualizador de PDF com comentários */}
          <div className="relative" style={{ height: "600px" }}>
            {/* PDF Viewer */}
            <div className="w-full h-full bg-gray-200">
              {/* Inserir visualizador de PDF aqui */}
              <iframe
                src={artigo.caminhoPDF}
                className="w-full h-full"
                title="Artigo PDF"
              />

              {/* Componente de comentários sobrepostos */}
              <CommentViewer comentarios={comentarios} />

              {/* Botão para adicionar comentários */}
              <ButtonComent
                onAddComment={adicionarComentario}
                comentarioTexto={comentarioTexto}
                onComentarioChange={handleComentarioChange}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Seção de avaliação */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-xl font-bold text-[#304358] mb-4">Avaliação</h3>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">Nota geral para este artigo:</p>
              <StarRating
                totalStars={5}
                initialRating={avaliacao}
                onRatingChange={handleRatingChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Selecione de 1 a 5 estrelas
              </p>
            </div>

            <button
              onClick={enviarAvaliacao}
              disabled={submitting}
              className={`px-6 py-3 bg-[#304358] text-white rounded-md hover:bg-blue-700 transition duration-200 flex items-center justify-center ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                "Enviar Avaliação Final"
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#304358] text-white py-3 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 BugWave - Sistema de Gestão Acadêmica</p>
        </div>
      </footer>
    </div>
  );
};

export default ArtigoAlunoPage;
