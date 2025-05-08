"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ButtonComent from "@/components/buttonComent/ButtonComent";

const Page = () => {
  const router = useRouter();

  const back = () => {
    router.push("/private/avaliador/artigos");
  };

  return (
    <div className="w-full h-[400vh] bg-slate-100 relative">
      <button
        className="px-4 py-2 bg-blue-800 hover:bg-blue-900 hover:cursor-pointer rounded-lg"
        onClick={back}
      >
        Voltar
      </button>

      <ButtonComent />
    </div>
  );
};

export default Page;
