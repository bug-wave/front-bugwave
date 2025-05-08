"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const back = () => {
    router.push("/private/avaliador/home");
  };
  const advanced = () => {
    router.push("/private/avaliador/artigoAluno");
  };

  return (
    <div className="w-full h-screen bg-slate-100 relative">
      <button
        className="px-4 py-2 bg-blue-800 hover:bg-blue-900 hover:cursor-pointer rounded-lg"
        onClick={back}
      >
        Voltar
      </button>
      <button
        className="px-4 py-2 bg-blue-800 hover:bg-blue-900 hover:cursor-pointer rounded-lg"
        onClick={advanced}
      >
        Avançar
      </button>
    </div>
  );
};

export default Page;
