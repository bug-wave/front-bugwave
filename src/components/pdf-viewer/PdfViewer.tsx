"use client";
import React, { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

type PdfViewerProps = {
  url: string;
  className?: string;
  onDocumentLoaded?: (instance: Awaited<ReturnType<typeof WebViewer>>) => void;
  children?: React.ReactNode;
};

const PdfViewer: React.FC<PdfViewerProps> = ({
  url,
  className,
  onDocumentLoaded,
  children,
}) => {
  const viewerDiv = useRef<HTMLDivElement>(null);
  const webviewerInstance = useRef<Awaited<
    ReturnType<typeof WebViewer>
  > | null>(null);

  useEffect(() => {
    if (!viewerDiv.current) return;

    // Inicializa o WebViewer
    WebViewer(
      {
        path: "/lib", // Caminho para as bibliotecas WebViewer
        initialDoc: url,
        disabledElements: ["searchButton", "menuButton"],
        isReadOnly: true, // Somente para visualização, sem edição
      },
      viewerDiv.current
    ).then((instance) => {
      // Salva a instância para uso posterior
      webviewerInstance.current = instance;

      // Acessa a API do WebViewer
      const { documentViewer } = instance.Core;

      // Evento disparado quando o documento termina de carregar
      documentViewer.addEventListener("documentLoaded", () => {
        if (onDocumentLoaded) {
          onDocumentLoaded(instance);
        }
      });
    });

    // Cleanup
    return () => {
      if (webviewerInstance.current) {
        webviewerInstance.current?.UI.dispose();
      }
    };
  }, [url, onDocumentLoaded]);

  return (
    <div className={`pdf-viewer-container ${className || "h-screen w-full"}`}>
      <div className="webviewer h-full w-full" ref={viewerDiv}></div>
      {children}
    </div>
  );
};

export default PdfViewer;
