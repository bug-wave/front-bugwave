/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload, FaArrowRight, FaTimes, FaTags } from "react-icons/fa";

type AreaTematica = {
  id: string;
  nome: string;
};

const UploadArtigoPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: "",
    autores: "",
    areaTematica: "",
    palavrasChave: "",
    resumo: "",
  });
  const [imagemFundo, setImagemFundo] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Áreas temáticas simuladas
  const areasTematicas: AreaTematica[] = [
    { id: "1", nome: "Inteligência Artificial" },
    { id: "2", nome: "Ciência de Dados" },
    { id: "3", nome: "Segurança da Informação" },
    { id: "4", nome: "Desenvolvimento Web" },
    { id: "5", nome: "Computação em Nuvem" },
    { id: "6", nome: "Internet das Coisas" },
    { id: "7", nome: "Blockchain" },
    { id: "8", nome: "Realidade Virtual e Aumentada" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemFundo(file);

      // Cria uma URL para preview da imagem
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setPreviewImagem(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = () => {
    setImagemFundo(null);
    setPreviewImagem(null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório";
    }

    if (!formData.autores.trim()) {
      newErrors.autores = "Pelo menos um autor deve ser informado";
    }

    if (!formData.areaTematica) {
      newErrors.areaTematica = "Selecione uma área temática";
    }

    if (!formData.palavrasChave.trim()) {
      newErrors.palavrasChave = "Informe pelo menos uma palavra-chave";
    }

    if (!formData.resumo.trim()) {
      newErrors.resumo = "O resumo é obrigatório";
    } else if (formData.resumo.trim().length < 100) {
      newErrors.resumo = "O resumo deve ter pelo menos 100 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simula o envio dos dados para o backend
    setTimeout(() => {
      // Em uma aplicação real, você enviaria os dados para o backend aqui
      console.log("Dados do formulário:", formData);
      console.log("Imagem de fundo:", imagemFundo);

      // Armazena os dados no localStorage para serem usados na próxima etapa
      localStorage.setItem(
        "uploadArtigoData",
        JSON.stringify({
          ...formData,
          temImagemFundo: !!imagemFundo,
        })
      );

      // Redireciona para a próxima etapa
      router.push("/private/alunos/upload-artigo-pdf");

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#304358] text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">Upload de Artigo</h1>
          <p className="mt-2 text-gray-200">
            Etapa 1 de 2: Informações Básicas
          </p>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card principal */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Área de preview da imagem de fundo */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {previewImagem ? (
                <>
                  <img
                    src={previewImagem}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removerImagem}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition duration-200"
                    aria-label="Remover imagem"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <div className="text-center text-white p-4">
                  <FaUpload className="mx-auto text-4xl mb-2 opacity-80" />
                  <p className="font-medium">
                    Adicione uma imagem de fundo para seu artigo
                  </p>
                  <p className="text-sm opacity-80 mt-1">
                    Recomendado: 1200 x 400 pixels
                  </p>
                </div>
              )}

              <label
                className={`absolute bottom-4 ${
                  previewImagem ? "left-4" : "mx-auto left-0 right-0 w-max"
                } bg-white text-[#304358] px-4 py-2 rounded-lg shadow-md font-medium cursor-pointer hover:bg-gray-100 transition duration-200`}
              >
                {previewImagem ? "Trocar imagem" : "Selecionar imagem"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagemChange}
                />
              </label>
            </div>

            {/* Formulário */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="titulo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Título do Artigo*
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.titulo ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#304358] transition duration-200`}
                    placeholder="Digite o título completo do seu artigo"
                  />
                  {errors.titulo && (
                    <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
                  )}
                </div>

                {/* Autores */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="autores"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Autor(es)*
                  </label>
                  <input
                    type="text"
                    id="autores"
                    name="autores"
                    value={formData.autores}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.autores ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#304358] transition duration-200`}
                    placeholder="Ex: João Silva, Maria Santos"
                  />
                  {errors.autores && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.autores}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Separe os nomes dos autores com vírgulas.
                  </p>
                </div>

                {/* Área Temática */}
                <div>
                  <label
                    htmlFor="areaTematica"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Área Temática*
                  </label>
                  <select
                    id="areaTematica"
                    name="areaTematica"
                    value={formData.areaTematica}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.areaTematica ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#304358] transition duration-200`}
                  >
                    <option value="">Selecione uma área</option>
                    {areasTematicas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nome}
                      </option>
                    ))}
                  </select>
                  {errors.areaTematica && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.areaTematica}
                    </p>
                  )}
                </div>

                {/* Palavras-chave */}
                <div>
                  <label
                    htmlFor="palavrasChave"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Palavras-chave*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTags className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="palavrasChave"
                      name="palavrasChave"
                      value={formData.palavrasChave}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.palavrasChave
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-[#304358] transition duration-200`}
                      placeholder="Ex: IA, Machine Learning, Algoritmos"
                    />
                  </div>
                  {errors.palavrasChave && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.palavrasChave}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Separe as palavras-chave com vírgulas.
                  </p>
                </div>

                {/* Resumo */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="resumo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Resumo*
                  </label>
                  <textarea
                    id="resumo"
                    name="resumo"
                    value={formData.resumo}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.resumo ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-[#304358] transition duration-200`}
                    placeholder="Digite um breve resumo do seu artigo"
                  />
                  {errors.resumo && (
                    <p className="mt-1 text-sm text-red-600">{errors.resumo}</p>
                  )}
                  <div className="mt-1 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Mínimo de 100 caracteres.
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.resumo.length} caracteres
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push("/private/alunos/artigos-publicados")}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#304358] text-white font-medium rounded-lg hover:bg-[#243242] transition duration-200 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  Processando...
                </>
              ) : (
                <>
                  Próximo passo <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadArtigoPage;
