"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonComent from "@/components/buttonComent/ButtonComent";
import WebViewer from "@/components/pdf-viewer/WebViewer";
import { Comment } from "@/components/commentTool/CommentTool";
import { FaSave, FaFilePdf, FaUser, FaStar, FaTags } from "react-icons/fa";
import StarRating from "@/components/starRating/StarRating";
import {
  ArtigoService,
  AvaliacaoService,
  ComentarioService,
} from "@/services/api";

// Interface para o artigo completo com detalhes
interface ArtigoDetalhado {
  _id: string;
  titulo: string;
  autores: string[];
  resumo: string;
  status: string;
  caminhoPDF: string;
  totalComentarios?: number;
  palavrasChave?: string[];
  nota?: number;
  comentarios: string[];
}

const ArtigoDetalhesPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [artigo, setArtigo] = useState<ArtigoDetalhado | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const artigoId = searchParams.get("id");

  // Voltar para a página de artigos
  const back = () => {
    router.back();
  };

  // Carregar dados do artigo e comentários
  useEffect(() => {
    const carregarDados = async () => {
      if (!artigoId) {
        setError("ID do artigo não fornecido");
        setLoading(false);
        return;
      }

      try {
        // Buscar dados do artigo
        const response = await fetch(
          `http://localhost:5000/artigo/${artigoId}`
        );

        if (!response.ok) {
          throw new Error(`Erro ao carregar artigo: ${response.status}`);
        }

        const artigoData = await response.json();
        setArtigo(artigoData);

        // Se houver uma nota já definida, usar como valor inicial
        if (artigoData.nota) {
          setRating(artigoData.nota);
        }

        // Buscar comentários do artigo
        if (artigoData.comentarios && artigoData.comentarios.length > 0) {
          const comentariosPromises = artigoData.comentarios.map(
            (comentarioId: string) => {
              return fetch(`http://localhost:5000/comentario/${comentarioId}`)
                .then((res) => res.json())
                .catch((err) => {
                  console.error("Erro ao buscar comentário:", err);
                  return null;
                });
            }
          );

          const comentariosData = (
            await Promise.all(comentariosPromises)
          ).filter(Boolean);

          // Adaptar o formato dos comentários para o componente ButtonComent
          const comentariosAdaptados = comentariosData.map(
            (comentario, index) => ({
              id: index + 1, // Gerar IDs numéricos sequenciais para compatibilidade
              text: comentario.texto || "",
              x: comentario.posicaoX || 100,
              y: comentario.posicaoY || 100,
              timestamp: comentario.dataCriacao
                ? new Date(comentario.dataCriacao).toLocaleString("pt-BR")
                : "Data não disponível",
              author: comentario.autorId
                ? typeof comentario.autorId === "object"
                  ? comentario.autorId.nome || "Avaliador"
                  : "Avaliador"
                : "Avaliador",
            })
          );

          setComments(comentariosAdaptados);
        }
      } catch (err) {
        const error = err as Error;
        console.error("Erro ao carregar dados:", error);
        setError(error.message || "Erro ao carregar dados do artigo");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [artigoId]);

  // Função para lidar com as mudanças nos comentários
  const handleCommentChange = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    console.log("Comentários atualizados:", updatedComments);
  };

  // Função para lidar com a mudança na avaliação por estrelas
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    console.log(`Nova avaliação: ${newRating} estrelas`);
  };

  // Função para salvar os comentários e avaliação
  const handleSave = async () => {
    if (!artigoId) {
      alert("ID do artigo não disponível");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Salvar avaliação final (nota) como coordenador
      const avaliacaoData = {
        artigoId,
        nota: rating,
        avaliadorId: localStorage.getItem("userId") || "1", // Idealmente, pegar o ID do usuário logado
        isFinal: true, // Indicar que é a avaliação final do coordenador
      };

      const avaliacaoResponse = await AvaliacaoService.create(avaliacaoData);

      if (!avaliacaoResponse.success) {
        throw new Error(`Erro ao salvar avaliação: ${avaliacaoResponse.error}`);
      }

      // 2. Salvar comentários novos - comentários com IDs temporários ou negativos
      const comentariosParaSalvar = comments.filter((c) => !c.id || c.id < 0);

      for (const comentario of comentariosParaSalvar) {
        const comentarioData = {
          artigoId,
          texto: comentario.text,
          posicaoX: comentario.x,
          posicaoY: comentario.y,
          autorId: localStorage.getItem("userId") || "1", // Idealmente, pegar o ID do usuário logado
          tipo: "COORDENADOR", // Indicar que é um comentário de coordenador
        };

        await ComentarioService.create(comentarioData);
      }

      // 3. Atualizar comentários editados - se houver um flag isEdited ou usando alguma lógica semelhante
      const comentariosEditados = comments.filter(
        (c) => c.id && c.id > 0 && c.isEdited === true
      );

      for (const comentario of comentariosEditados) {
        const comentarioData = {
          id: String(comentario.id), // Converter para string conforme esperado pela API
          texto: comentario.text,
          posicaoX: comentario.x,
          posicaoY: comentario.y,
        };

        await ComentarioService.update(comentarioData);
      }

      alert("Avaliação e comentários salvos com sucesso!");
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao salvar dados:", err);
      alert(`Erro ao salvar: ${err.message || "Erro desconhecido"}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#304358]"></div>
      </div>
    );
  }

  if (error || !artigo) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">❗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Artigo não encontrado"}
          </h2>
          <p className="text-gray-600 mb-6">
            O artigo solicitado não foi encontrado ou não está disponível.
          </p>
          <button
            onClick={back}
            className="px-6 py-2 bg-[#304358] text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Voltar para artigos
          </button>
        </div>
      </div>
    );
  }

  // Usar a URL do PDF da variável de ambiente ou do artigo
  const pdfUrl =
    "https://uploader-documents.s3.amazonaws.com/1746733502582-Projeto_Pesquisa-G6.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY2ZZXWMZJFSZPEV3%2F20250508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250508T194505Z&X-Amz-Expires=3600&X-Amz-Signature=01f20822a8d7f75dc1783be078a0fc0a270493e322d2779b53b3d80daa1314c2&X-Amz-SignedHeaders=host";

  return (
    <div className="w-full">
      <div className="h-12 bg-[#304358] flex items-center px-4">
        <button
          className="px-4 py-2 bg-[#304358] h-fit w-fit text-white font-semibold hover:bg-opacity-80 hover:cursor-pointer rounded-lg transition-all"
          onClick={back}
        >
          Voltar
        </button>
      </div>
      <div className="flex justify-between bg-gray-200 min-h-screen">
        <div className="w-14"></div>
        <div className="flex flex-col h-auto">
          <div className="bg-white min-h-screen h-full w-[25vw] p-4 shadow-2xl shadow-black">
            <div className="flex flex-col gap-6 fixed h-full w-[25vw]">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <FaFilePdf className="text-3xl text-[#304358]" />
              </div>
              <h1 className="font-bold text-xl text-[#304358]">
                {artigo.titulo}
              </h1>
              <h2 className="font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-600" />
                  <span>
                    Autores: {artigo.autores?.join(", ") || "Não especificado"}
                  </span>
                </div>
              </h2>
              {artigo.nota && (
                <h2 className="font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <span>Nota: {artigo.nota}</span>
                  </div>
                </h2>
              )}
              {artigo.palavrasChave && artigo.palavrasChave.length > 0 && (
                <h2 className="font-semibold text-gray-800">
                  <div className="flex items-start gap-2">
                    <FaTags className="text-gray-600 mt-1" />
                    <span>
                      Palavras-chave:{" "}
                      <span className="text-[#304358] font-medium">
                        {artigo.palavrasChave.join(", ")}
                      </span>
                    </span>
                  </div>
                </h2>
              )}
              {artigo.resumo && (
                <div className="mt-4 p-5">
                  <h3 className="font-semibold text-gray-800 mb-2">Resumo:</h3>
                  <p className="text-gray-700">{artigo.resumo}</p>
                </div>
              )}

              {/* Componente de avaliação por estrelas */}
            </div>
          </div>
        </div>
        <div className="w-[25vw] h-full">
          <ButtonComent
            role="coordenador"
            initialComments={comments}
            onCommentChange={handleCommentChange}
          />
          <div className="shadow-xl shadow-black/50">
            <WebViewer pdfUrl={pdfUrl} />
          </div>
        </div>
        <div className="bg-white w-[25vw] min-h-screen p-10 shadow-2xl shadow-black">
          <div className=" flex items-start flex-col">
            <h3 className="font-semibold text-gray-800 mb-3">
              Avaliação final:
            </h3>
            <StarRating
              initialRating={rating}
              onChange={handleRatingChange}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Botão de salvar fixado no canto inferior direito */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="fixed bottom-8 right-8 flex items-center justify-center gap-2 bg-[#304358] hover:bg-[#1e2e3d] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 z-50"
      >
        <FaSave className={`${isSaving ? "animate-pulse" : ""}`} />
        {isSaving ? "Salvando..." : "Salvar comentários"}
      </button>
    </div>
  );
};

export default ArtigoDetalhesPage;
