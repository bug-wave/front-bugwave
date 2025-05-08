"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonComent from "@/components/buttonComent/ButtonComent";
import WebViewer from "@/components/pdf-viewer/WebViewer";
import { Comment } from "@/components/commentTool/CommentTool";
import { FaSave, FaFilePdf, FaUser, FaStar, FaTags } from "react-icons/fa";
import StarRating from "@/components/starRating/StarRating";

// Interface para o artigo completo com detalhes
interface ArtigoDetalhado {
  id: string;
  titulo: string;
  autores: string[];
  resumo: string;
  status: string;
  caminhoPDF: string;
  eventoId: string;
  dataEnvio: string;
  totalComentarios: number;
  palavrasChave: string[];
  nota?: number;
}

const ArtigoDetalhesPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [artigo, setArtigo] = useState<ArtigoDetalhado | null>(null);
  const [rating, setRating] = useState<number>(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const artigoId = searchParams.get("id");

  // Voltar para a página de artigos
  const back = () => {
    router.back();
  };

  // Carregar dados do artigo
  useEffect(() => {
    const carregarArtigo = async () => {
      if (!artigoId) {
        router.push("/private/coordenador/evento");
        return;
      }

      try {
        // Em um ambiente real, buscaríamos os dados do artigo da API
        const response = await fetch(`/api/artigos/${artigoId}`);
        const data = await response.json();
        setArtigo(data);

        // Carregar comentários existentes
        const commentsResponse = await fetch(
          `/api/artigos/${artigoId}/comentarios`
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Erro ao carregar artigo:", error);

        // Dados mockados para visualização
        setArtigo({
          id: artigoId || "1",
          titulo:
            "Inteligência Artificial na Medicina: Aplicações e Desafios Éticos",
          autores: ["Maria Silva", "João Oliveira"],
          resumo:
            "Este artigo discute o impacto da IA na medicina moderna, abordando tanto os avanços tecnológicos quanto as questões éticas envolvidas.",
          status: "EM_AVALIACAO",
          caminhoPDF: process.env.NEXT_PUBLIC_PDF_URL || "/pdf/ACEx_5.pdf", // Usando variável de ambiente
          eventoId: "1",
          dataEnvio: "15/04/2025",
          totalComentarios: 7,
          palavrasChave: [
            "Inteligência Artificial",
            "Medicina",
            "Ética",
            "Tecnologia",
          ],
          nota: 8.5,
        });

        // Comentários mockados
        const mockComments = [
          {
            id: 1,
            x: 150,
            y: 200,
            text: "A metodologia utilizada precisa ser mais detalhada na seção 3.",
            author: "Dr. Carlos Mendes",
            timestamp: "01/05/2025 14:30",
          },
          {
            id: 2,
            x: 200,
            y: 350,
            text: "Excelente análise dos impactos éticos da tecnologia.",
            author: "Profa. Ana Souza",
            timestamp: "03/05/2025 09:15",
          },
        ];
        setComments(mockComments);
      } finally {
        setLoading(false);
      }
    };

    carregarArtigo();
  }, [artigoId, router]);

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

  // Função para salvar os comentários
  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Em um ambiente real, faríamos uma chamada à API
      // await fetch(`/api/artigos/${artigoId}/comentarios`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comments, rating })
      // });

      // Simulação de chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Comentários salvos:", comments);
      console.log("Avaliação salva:", rating);
      alert("Comentários e avaliação salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Por favor, tente novamente.");
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

  if (!artigo) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">❗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Artigo não encontrado
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
        <div className=""></div>
        <div className="flex flex-col h-full">
          <div className="bg-white min-h-screen w-[30vw] p-10">
            <div className="flex flex-col gap-6 fixed w-[25vw]">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <FaFilePdf className="text-3xl text-[#304358]" />
              </div>
              <h1 className="font-bold text-xl text-[#304358]">
                {artigo.titulo}
              </h1>
              <h2 className="font-semibold text-gray-800">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-600" />
                  <span>Autores: {artigo.autores.join(", ")}</span>
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
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Resumo:</h3>
                <p className="text-gray-700">{artigo.resumo}</p>
              </div>

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
          <WebViewer pdfUrl={artigo.caminhoPDF} />
        </div>
        <div className="bg-white w-[30%] min-h-screen p-5 flex flex-col items-center">
          <div className="mt-6 pt-4 ">
            <h3 className="font-semibold text-gray-800 mb-3">
              Avalie este artigo:
            </h3>
            <StarRating
              initialRating={artigo.nota || 0}
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
