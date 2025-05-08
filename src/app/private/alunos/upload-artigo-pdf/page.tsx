"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaFileAlt,
  FaCloudUploadAlt,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaEye,
} from "react-icons/fa";

type FormData = {
  titulo: string;
  autores: string;
  areaTematica: string;
  palavrasChave: string;
  resumo: string;
  temImagemFundo: boolean;
};

const UploadArtigoPdfPage = () => {
  const router = useRouter();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Recupera os dados da etapa anterior
  useEffect(() => {
    const savedData = localStorage.getItem("uploadArtigoData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (err) {
        console.error("Erro ao carregar dados do artigo:", err);
        setError(
          "Não foi possível recuperar os dados do artigo. Por favor, retorne à etapa anterior."
        );
      }
    } else {
      setError(
        "Nenhuma informação do artigo encontrada. Por favor, preencha as informações básicas primeiro."
      );
    }
  }, []);

  // Gerencia o evento de arrastar e soltar
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Processa o arquivo PDF quando enviado
  const handlePdfChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ) => {
    e.preventDefault();

    let file: File | null = null;

    if ("dataTransfer" in e) {
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        file = e.dataTransfer.files[0];
      }
    } else if (e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
    }

    if (file) {
      // Verifica se o arquivo é um PDF
      if (file.type !== "application/pdf") {
        setError("Por favor, selecione apenas arquivos PDF.");
        return;
      }

      // Verifica o tamanho do arquivo (limite de 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(
          "O arquivo é muito grande. O tamanho máximo permitido é 10MB."
        );
        return;
      }

      setPdfFile(file);
      setError(null);

      // Cria um URL para visualização do PDF
      const fileUrl = URL.createObjectURL(file);
      setPdfPreview(fileUrl);
    }
  };

  // Remove o arquivo PDF selecionado
  const handleRemovePdf = () => {
    setPdfFile(null);
    if (pdfPreview) {
      URL.revokeObjectURL(pdfPreview);
      setPdfPreview(null);
    }
  };

  // Simula o upload do arquivo com uma barra de progresso
  const simulateUpload = () => {
    let progress = 0;
    setUploadProgress(0);

    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        setUploadSuccess(true);
        setIsLoading(false);
      }
      setUploadProgress(Math.floor(progress));
    }, 300);
  };

  // Envia o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdfFile) {
      setError("Por favor, selecione um arquivo PDF para enviar.");
      return;
    }

    setIsLoading(true);
    simulateUpload();
  };

  // Redireciona para a página principal após um upload bem-sucedido
  const handleFinish = () => {
    // Limpa os dados do localStorage
    localStorage.removeItem("uploadArtigoData");

    // Redireciona para a página de artigos publicados
    router.push("/private/alunos/artigos-publicados");
  };

  if (error && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center text-red-500 mb-6">
            <FaTimes className="mx-auto text-5xl" />
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Erro</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => router.push("/private/alunos/upload-artigo")}
            className="w-full px-6 py-3 bg-[#304358] text-white font-medium rounded-lg hover:bg-[#243242] transition duration-200"
          >
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#304358] text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Upload de Artigo</h1>
          <p className="mt-2 text-gray-200">
            Etapa 2 de 2: Upload do documento PDF
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
        {/* Resumo dos dados do artigo */}
        {formData && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-[#304358] mb-4">
              Resumo das informações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Título</p>
                <p className="text-lg font-semibold">{formData.titulo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Autor(es)</p>
                <p>{formData.autores}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Palavras-chave
                </p>
                <p>{formData.palavrasChave}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Área Temática
                </p>
                <p>{formData.areaTematica}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Resumo</p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {formData.resumo}
              </p>
            </div>
          </div>
        )}

        {uploadSuccess ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
              <FaCheck className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Upload concluído com sucesso!
            </h2>
            <p className="text-gray-600 mb-8">
              Seu artigo foi enviado e será revisado pela nossa equipe. Você
              receberá uma notificação quando o processo de revisão for
              finalizado.
            </p>
            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-[#304358] text-white font-medium rounded-lg hover:bg-[#243242] transition duration-200"
            >
              Ver meus artigos
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Área de upload */}
            <div
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                dragActive ? "border-2 border-blue-500" : ""
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handlePdfChange}
            >
              {!pdfFile ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-[#304358] mb-6">
                    <FaCloudUploadAlt className="text-4xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Faça upload do seu artigo em PDF
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Arraste e solte o arquivo aqui ou clique para selecionar
                  </p>
                  <label className="inline-block px-6 py-3 bg-[#304358] text-white font-medium rounded-lg hover:bg-[#243242] transition duration-200 cursor-pointer">
                    Selecionar arquivo PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePdfChange}
                    />
                  </label>
                  <p className="mt-4 text-xs text-gray-500">
                    Tamanho máximo: 10MB. Apenas arquivos PDF são aceitos.
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-[#304358] text-white p-3 rounded">
                        <FaFileAlt className="text-xl" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{pdfFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {pdfPreview && (
                        <a
                          href={pdfPreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition duration-150"
                          title="Visualizar PDF"
                        >
                          <FaEye />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleRemovePdf}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition duration-150"
                        title="Remover arquivo"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>

                  {isLoading && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Enviando arquivo...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-[#304358] h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaTimes className="text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push("/private/alunos/upload-artigo")}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-200"
              >
                <FaArrowLeft className="mr-2" /> Voltar
              </button>
              <button
                type="submit"
                disabled={!pdfFile || isLoading}
                className={`px-8 py-3 font-medium rounded-lg transition duration-200 flex items-center ${
                  !pdfFile || isLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-[#304358] text-white hover:bg-[#243242]"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    Finalizar envio <FaCloudUploadAlt className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadArtigoPdfPage;
