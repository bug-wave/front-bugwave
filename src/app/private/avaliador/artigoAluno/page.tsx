"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CommentTool from "@/components/commentTool/CommentTool";
import WebViewer from "@/components/pdf-viewer/WebViewer";

const Page = () => {
  const router = useRouter();

  const back = () => {
    router.push("/private/avaliador/artigos");
  };

  const url = "https://uploader-documents.s3.amazonaws.com/1746687346294-tarefafaltaluz.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY2ZZXWMZJFSZPEV3%2F20250508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250508T065549Z&X-Amz-Expires=3600&X-Amz-Signature=02bee8ceb25d3714a6928ab71360dce561b106eec0a83627e9b08483b977d7de&X-Amz-SignedHeaders=host"

  return (
    <div>
    <div className="h-12 bg-[#304358]">
    <button
        className="px-4 py-2 bg-[#304358] h-fit w-fit text-white font-semibold hover:cursor-pointer rounded-lg"
        onClick={back}
      >
        Voltar
      </button>
    </div>
      {/* <CommentTool className="w-full h-full" /> */}
      <div className="flex justify-between bg-gray-200 h-[100vh]">
          <div className="">
          </div>
          <div className="flex flex-col h-full">
              <div className="bg-white h-full w-fit p-10">
                <div className="flex flex-col gap-6">
                  <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                  <h1 className="font-bold text-xl text-[#304358]">Titulo do Artigo</h1>
                  <h1 className="font-semibold text-gray-800">Nome do Autor</h1>
                  <h1 className="font-semibold text-gray-800">Nota: </h1>
                  <h1 className="font-semibold text-gray-800">Palavras-chave: <span className="text-[#304358] font-medium">Informação, tecnologia, inovação</span></h1>
                </div>
              </div>
          </div>
          <div className="w-[30%]">
            <WebViewer pdfUrl={url}/>
          </div>
          <div className="bg-white w-[30%] h-full">

          </div>

      </div>
    </div>
  );
};

export default Page;
