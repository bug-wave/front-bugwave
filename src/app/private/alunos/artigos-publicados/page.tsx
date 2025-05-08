"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaFilePdf,
  FaEye,
  FaCommentAlt,
  FaCalendarAlt,
  FaCheck,
  FaHistory,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

// Tipo para representar um artigo
type Artigo = {
  id: string;
  titulo: string;
  status: string;
  dataEnvio: string;
  totalComentarios: number;
  caminhoPDF: string;
};

const AlunosPage = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const router = useRouter();

  const back = () => {
    router.push("/private/alunos/home");
  };

  const goToUploadFile = () => {
    router.push("/private/alunos/upload-artigo");
  };

  useEffect(() => {
    // Em uma aplicação real, você buscaria os dados dos artigos da API
    // Aqui estamos simulando com dados mocados
    setTimeout(() => {
      const artigosMockados: Artigo[] = [
        {
          id: "1",
          titulo: "Inteligência Artificial na Medicina",
          status: "EM_AVALIACAO",
          dataEnvio: "15/04/2025",
          totalComentarios: 3,
          caminhoPDF: "/pdf/ACEx_5.pdf",
        },
        {
          id: "2",
          titulo: "Energias Renováveis no Brasil",
          status: "APROVADO",
          dataEnvio: "10/03/2025",
          totalComentarios: 2,
          caminhoPDF: "/pdf/ACEx_5.pdf",
        },
        {
          id: "3",
          titulo: "Arquitetura de Software: Microserviços vs Monolítico",
          status: "REVISAO_SOLICITADA",
          dataEnvio: "01/05/2025",
          totalComentarios: 5,
          caminhoPDF: "/pdf/ACEx_5.pdf",
        },
      ];

      setArtigos(artigosMockados);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Função para obter informações de status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "APROVADO":
        return {
          class: "bg-green-50 text-green-800 border-green-200",
          icon: <FaCheck className="text-green-500" />,
          text: "Aprovado",
        };
      case "REPROVADO":
        return {
          class: "bg-red-50 text-red-800 border-red-200",
          icon: <FaExclamationTriangle className="text-red-500" />,
          text: "Reprovado",
        };
      case "EM_AVALIACAO":
        return {
          class: "bg-blue-50 text-blue-800 border-blue-200",
          icon: <FaHistory className="text-blue-500 animate-spin-slow" />,
          text: "Em Avaliação",
        };
      case "REVISAO_SOLICITADA":
        return {
          class: "bg-yellow-50 text-yellow-800 border-yellow-200",
          icon: <FaExclamationTriangle className="text-yellow-500" />,
          text: "Revisão Solicitada",
        };
      case "EM_CONFIRMACAO":
        return {
          class: "bg-gray-50 text-gray-800 border-gray-200",
          icon: <FaHistory className="text-gray-500" />,
          text: "Em Confirmação",
        };
      default:
        return {
          class: "bg-gray-50 text-gray-800 border-gray-200",
          icon: <FaHistory className="text-gray-500" />,
          text: status,
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#304358]"></div>
            <p className="mt-4 text-lg font-medium text-[#304358]">
              Carregando seus artigos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="p-8 rounded-lg shadow-lg bg-white border border-red-200 max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Erro ao carregar
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="px-6 py-2 bg-[#304358] text-white rounded-md hover:bg-[#243242] transition duration-200 shadow-md"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            className="px-4 py-2 bg-[#304358] h-fit w-fit text-white font-semibold hover:cursor-pointer rounded-lg"
            onClick={back}
          >
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-[#304358]">Meus Artigos</h1>
          <button
            onClick={goToUploadFile}
            className="px-5 py-2 bg-[#304358] text-white rounded-md hover:bg-[#243242] transition-colors duration-200 flex items-center shadow-md"
          >
            <FaFilePdf className="mr-2" /> Enviar novo artigo
          </button>
        </div>

        {artigos.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <FaFilePdf className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Nenhum artigo encontrado
            </h2>
            <p className="text-gray-600 mb-8">
              Você ainda não possui artigos enviados. Comece enviando seu
              primeiro artigo para avaliação.
            </p>
            <button className="px-6 py-3 bg-[#304358] text-white font-medium rounded-md hover:bg-[#243242] transition-colors duration-200 shadow-md">
              Enviar novo artigo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigos.map((artigo) => {
              const statusInfo = getStatusInfo(artigo.status);

              return (
                <div
                  key={artigo.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-5 h-1/2">
                    <div className="flex items-start h-full">
                      <div className="bg-[#304358] p-3 rounded-md text-white mr-4">
                        <FaFilePdf className="text-xl" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl text-gray-800 line-clamp-2 mb-2">
                          {artigo.titulo}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <FaCalendarAlt className="mr-1" />
                          <span>{artigo.dataEnvio}</span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <FaCommentAlt className="mr-1" />
                            <span>{artigo.totalComentarios} comentários</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex items-center p-3 rounded-md border ${statusInfo.class} mt-4 mb-6`}
                    >
                      {statusInfo.icon}
                      <span className="ml-2 font-medium">
                        {statusInfo.text}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href={`/private/alunos/visualizar-comentarios?id=${artigo.id}`}
                        className="px-4 py-2 bg-[#304358] bg-opacity-10 text-white font-medium rounded-md hover:bg-opacity-20 transition-colors duration-200 flex items-center"
                      >
                        <FaEye className="mr-2 " />
                        Visualizar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlunosPage;
