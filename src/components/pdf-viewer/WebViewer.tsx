"use client";

import { useEffect, useRef } from "react";

interface WebViewerProps {
  pdfUrl: string;
}

export default function WebViewer({ pdfUrl }: WebViewerProps) {
  const viewer = useRef<HTMLDivElement | null>(null);
  const instance = useRef<any>(null);
  const hasInitialized = useRef<boolean>(false);

  useEffect(() => {
    // Evita inicialização múltipla no modo strict do React
    if (hasInitialized.current) {
      console.log(
        "WebViewer já foi inicializado, ignorando chamada redundante"
      );
      return;
    }

    // Garante que o elemento de referência exista
    if (!viewer.current) return;

    console.log("Inicializando WebViewer pela primeira vez");

    // Marca que a inicialização já ocorreu
    hasInitialized.current = true;

    // Carrega a biblioteca WebViewer
    import("@pdftron/webviewer")
      .then((module) => {
        const WebViewerLib = module.default;
        WebViewerLib(
          {
            path: "/lib",
            initialDoc: pdfUrl,
            disabledElements: ["searchButton", "menuButton"],
          },
          viewer.current as HTMLDivElement
        ).then((webviewerInstance) => {
          console.log("PDF carregado com sucesso");
          instance.current = webviewerInstance;
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar WebViewer:", error);
        // Reinicia o flag em caso de erro para permitir nova tentativa
        hasInitialized.current = false;
      });

    // Função de limpeza ao desmontar o componente
    return () => {
      if (instance.current) {
        try {
          instance.current.dispose();
        } catch (error) {
          console.error("Erro ao limpar instância:", error);
        }
        instance.current = null;
      }
      // Não reiniciamos o flag hasInitialized aqui para evitar inicialização em re-renders
    };
  }, []); // Removendo pdfUrl das dependências para garantir execução única

  // Se o URL do PDF mudar, atualizamos o documento sem reinicializar o componente
  useEffect(() => {
    if (!instance.current || !hasInitialized.current) return;

    try {
      console.log("Atualizando documento do WebViewer para:", pdfUrl);
      const { Core } = instance.current;
      Core.documentViewer.loadDocument(pdfUrl);
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
    }
  }, [pdfUrl]);

  return (
    <div className="w-full h-full">
      <div className="webviewer w-full h-auto" ref={viewer}></div>
    </div>
  );
}
