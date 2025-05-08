"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ButtonComent from "@/components/buttonComent/ButtonComent";
import WebViewer from "@/components/pdf-viewer/WebViewer";
import { Comment } from "@/components/commentTool/CommentTool";
import { FaSave } from "react-icons/fa";

const Page = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const back = () => {
    router.push("/private/avaliador/artigos");
  };

  // Função para lidar com as mudanças nos comentários
  const handleCommentChange = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    // Aqui você pode enviar os comentários para o backend ou armazená-los de outra forma
    console.log("Comentários atualizados:", updatedComments);
  };

  // Função para salvar os comentários e redirecionar para a visualização do aluno
  const handleSave = () => {
    setIsSaving(true);

    // Simula uma chamada à API para salvar os comentários
    setTimeout(() => {
      // Aqui você salvaria os comentários no backend
      console.log("Comentários salvos:", comments);

      // Em um ambiente real, você enviaria os dados para o backend antes de redirecionar

      // Redireciona para a página de visualização do aluno
      router.push("/private/alunos/visualization");

      setIsSaving(false);
    }, 1000);
  };

  const url =
    "https://uploader-documents.s3.amazonaws.com/1746690033550-Trabalho%20Gest%C3%83%C2%A3o%20de%20Projetos%20Grupo%204.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY2ZZXWMZNBMGRX7T%2F20250508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250508T074044Z&X-Amz-Expires=9999&X-Amz-Signature=e896702b58dbf23bda91089b61311438f2b3c3dbf0817f3f8095e73c3c230a92&X-Amz-SignedHeaders=host";

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
              <div className="w-20 h-20 rounded-full bg-gray-200"></div>
              <h1 className="font-bold text-xl text-[#304358]">
                Titulo do Artigo
              </h1>
              <h1 className="font-semibold text-gray-800">Nome do Autor</h1>
              <h1 className="font-semibold text-gray-800">Nota: </h1>
              <h1 className="font-semibold text-gray-800">
                Palavras-chave:{" "}
                <span className="text-[#304358] font-medium">
                  Informação, tecnologia, inovação
                </span>
              </h1>
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
