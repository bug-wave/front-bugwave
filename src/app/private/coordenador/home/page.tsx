"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CoordenadorHomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redireciona automaticamente para a página de eventos
    router.replace("/private/coordenador/evento");
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default CoordenadorHomePage;
