"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonComent from "@/components/buttonComent/ButtonComent";
import WebViewer from "@/components/pdf-viewer/WebViewer";
import { Comment } from "@/components/commentTool/CommentTool";
import { FaSave } from "react-icons/fa";
import StarRating from "@/components/starRating/StarRating";
import {
  ArtigoService,
  AvaliacaoService,
  ComentarioService,
} from "@/services/api";

interface Artigo {
  id: string;
  titulo: string;
  autores: string[];
  resumo: string;
  status: string;
  caminhoPDF: string;
  eventoId: string;
  nota?: number;
}

const Page = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const artigoId = searchParams.get("id");

  // Carregar dados do artigo e comentários
  useEffect(() => {
    const carregarDados = async () => {
      if (!artigoId) {
        setError("ID do artigo não fornecido");
        setIsLoading(false);
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
        const comentariosResponse = await fetch(
          `http://localhost:5000/comentario/artigo/${artigoId}`
        );

        if (!comentariosResponse.ok) {
          throw new Error(
            `Erro ao carregar comentários: ${comentariosResponse.status}`
          );
        }

        const comentariosData = await comentariosResponse.json();

        // Adaptar o formato dos comentários para o componente ButtonComent
        const comentariosAdaptados = comentariosData.map((comentario: any) => ({
          id: comentario.id,
          text: comentario.texto,
          x: comentario.posicaoX || 100,
          y: comentario.posicaoY || 100,
          timestamp: new Date(comentario.dataCriacao).toLocaleString("pt-BR"),
          author: comentario.autor || "Avaliador",
        }));

        setComments(comentariosAdaptados);
      } catch (err: any) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados do artigo");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [artigoId]);

  const back = () => {
    router.push("/private/avaliador/artigos");
  };

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
      // 1. Salvar avaliação (nota)
      const avaliacaoData = {
        artigoId,
        nota: rating,
        avaliadorId: localStorage.getItem("userId") || "1", // Idealmente, pegar o ID do usuário logado
      };

      const avaliacaoResponse = await AvaliacaoService.create(avaliacaoData);

      if (!avaliacaoResponse.success) {
        throw new Error(`Erro ao salvar avaliação: ${avaliacaoResponse.error}`);
      }

      // 2. Salvar comentários - para cada comentário novo (sem ID)
      const comentariosParaSalvar = comments.filter(
        (c) => !c.id || (typeof c.id === "string" && c.id.startsWith("temp_"))
      );

      for (const comentario of comentariosParaSalvar) {
        const comentarioData = {
          artigoId,
          texto: comentario.text,
          posicaoX: comentario.x,
          posicaoY: comentario.y,
          autorId: localStorage.getItem("userId") || "1", // Idealmente, pegar o ID do usuário logado
        };

        await ComentarioService.create(comentarioData);
      }

      // 3. Atualizar comentários editados
      const comentariosParaAtualizar = comments.filter(
        (c) => c.id && !String(c.id).startsWith("temp_") && c.isEdited
      );

      for (const comentario of comentariosParaAtualizar) {
        const comentarioData = {
          id: comentario.id,
          texto: comentario.text,
          posicaoX: comentario.x,
          posicaoY: comentario.y,
        };

        await ComentarioService.update(comentarioData);
      }

      alert("Avaliação e comentários salvos com sucesso!");

      // Redireciona para a página de artigos
      router.push("/private/avaliador/artigos");
    } catch (err: any) {
      console.error("Erro ao salvar dados:", err);
      alert(`Erro ao salvar: ${err.message || "Erro desconhecido"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Usar a URL do PDF da variável de ambiente ou do artigo
  const url =
    artigo?.caminhoPDF || process.env.NEXT_PUBLIC_PDF_URL || "/pdf/ACEx_5.pdf";

  if (isLoading) {
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
            Ocorreu um erro ao carregar as informações do artigo.
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

  return (
    <div className="w-full">
      <div className="h-12 bg-[#304358]">
        <button
          className="px-4 py-2 bg-[#304358] h-fit w-fit text-white font-semibold hover:cursor-pointer rounded-lg"
          onClick={back}
        >
          Voltar
        </button>
      </div>
      <div className="flex justify-between bg-gray-200 min-h-screen">
        <div className=""></div>
        <div className="flex flex-col h-full">
          <div className="bg-white min-h-screen w-fit p-10">
            <div className="flex flex-col gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-500"
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
              <h1 className="font-bold text-xl text-[#304358]">
                {artigo.titulo}
              </h1>
              <h1 className="font-semibold text-gray-800">
                {artigo.autores?.join(", ") || "Autor desconhecido"}
              </h1>
              <div className="font-semibold text-gray-800">
                <div className="flex flex-col gap-2">
                  <span>Avaliação:</span>
                  <StarRating
                    initialRating={rating}
                    onChange={handleRatingChange}
                    size="lg"
                  />
                </div>
              </div>
              {artigo.resumo && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Resumo:</h3>
                  <p className="text-gray-700">{artigo.resumo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-[30%] h-full">
          <ButtonComent
            role="avaliador"
            initialComments={comments}
            onCommentChange={handleCommentChange}
          />
          <WebViewer pdfUrl={url} />
        </div>
        <div className="bg-white w-[30%] min-h-screen"></div>
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

export default Page;
