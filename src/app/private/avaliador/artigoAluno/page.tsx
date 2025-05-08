"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CommentTool from "@/components/commentTool/CommentTool";

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
      <CommentTool className="w-full h-full" />
    </div>
  );
};

export default Page;
