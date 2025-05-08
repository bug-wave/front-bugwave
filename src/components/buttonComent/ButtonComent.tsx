// ButtonComent.tsx
"use client";
import React, { useState, useEffect } from "react";
import CommentTool from "../commentTool/CommentTool";

const ButtonComent = () => {
  const [adding, setAdding] = useState(false);
  const [buttonText, setButtonText] = useState("Adicionar comentário");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (adding) {
      // Se já estiver no estado de adição, não faz nada
      return;
    }

    // Alterna para o estado "Feito"
    setAdding(true);
    setButtonText("Feito");

    // Configura um timer para voltar ao estado original após 2 segundos
    const newTimer = setTimeout(() => {
      setAdding(false);
      setButtonText("Adicionar comentário");
    }, 2000);

    setTimer(newTimer);
  };

  // Limpa o timer ao desmontar o componente para evitar vazamentos de memória
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <div className="w-[30%] h-[250vh] absolute top-12 z-10">
      <button
        onClick={handleClick}
        className={`px-4 py-2 absolute z-20 -left-[90%] top-96 transition-y-1/2 text-white rounded ${
          adding
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {buttonText}
      </button>

      <CommentTool adding={adding} setAdding={setAdding} />
    </div>
  );
};

export default ButtonComent;
