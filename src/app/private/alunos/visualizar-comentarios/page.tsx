"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WebViewer from "@/components/pdf-viewer/WebViewer";
import CommentViewer from "@/components/commentViewer/CommentViewer";

// Tipo para comentários com coordenadas x e y
type Comment = {
  id: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
};

const VisualizarComentariosPage = () => {
  const router = useRouter();
  type Artigo = {
    id: string;
    titulo: string;
    autor: string;
    nota: string;
    palavrasChave: string[];
    caminhoPDF: string;
  };

  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const back = () => {
    router.push("/private/alunos/artigos-publicados");
  };

  useEffect(() => {
    // Em uma aplicação real, você buscaria os dados do artigo e os comentários da API
    // Aqui estamos simulando com dados mocados
    setTimeout(() => {
      const artigoMockado = {
        id: "1",
        titulo: "Inteligência Artificial na Medicina",
        autor: "Maria Silva",
        nota: "8.5",
        palavrasChave: ["IA", "Medicina", "Saúde"],
        caminhoPDF: "/pdf/ACEx_5.pdf",
      };

      const comentariosMockados: Comment[] = [
        {
          id: 1,
          x: 550,
          y: 200,
          text: "Esta seção precisa de mais referências bibliográficas atualizadas.",
          author: "Prof. Carlos Santos",
          timestamp: "10/05/2025 14:30",
        },
        {
          id: 2,
          x: 550,
          y: 350,
          text: "Excelente abordagem metodológica! Considere expandir a análise dos resultados.",
          author: "Dra. Ana Ferreira",
          timestamp: "11/05/2025 09:15",
        },
        {
          id: 3,
          x: 550,
          y: 500,
          text: "Revise esta conclusão, pois ela não aborda completamente os objetivos apresentados na introdução.",
          author: "Prof. Carlos Santos",
          timestamp: "11/05/2025 16:20",
        },
        {
          id: 4,
          x: 550,
          y: 1500,
          text: "Revise esta conclusão, pois ela não aborda completamente os objetivos apresentados na introdução.",
          author: "Prof. Carlos Santos",
          timestamp: "11/05/2025 16:20",
        },
      ];

      setArtigo(artigoMockado);
      setComments(comentariosMockados);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Carregando artigo e comentários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Erro ao carregar: {error}</p>
          <button
            className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const url = "/pdf/ACEx_5.pdf";

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
        <div className="flex flex-col h-auto">
          <div className="bg-white w-[25vw] min-h-screen p-10 h-full">
            <div className="flex flex-col gap-6 fixed">
              <div className="w-20 h-20 rounded-full bg-gray-200"></div>
              <h1 className="font-bold text-xl text-[#304358]">
                {artigo?.titulo || "Título não disponível"}
              </h1>
              <h1 className="font-semibold text-gray-800">
                Autor: {artigo?.autor}
              </h1>
              <h1 className="font-semibold text-gray-800">
                Nota: {artigo?.nota}
              </h1>
              <h1 className="font-semibold text-gray-800">
                Palavras-chave:{" "}
                <span className="text-[#304358] font-medium">
                  {artigo?.palavrasChave.join(", ")}
                </span>
              </h1>
              <div className="mt-6">
                <h2 className="font-semibold text-gray-800 mb-2">
                  Comentários: {comments.length}
                </h2>
                {comments.map((comment, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="text-xs text-gray-500">{comment.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] h-full relative">
          <CommentViewer comments={comments} className="absolute z-10" />
          <WebViewer pdfUrl={url} />
        </div>
        <div className="bg-white w-[30%] min-h-screen"></div>
      </div>
    </div>
  );
};

export default VisualizarComentariosPage;
