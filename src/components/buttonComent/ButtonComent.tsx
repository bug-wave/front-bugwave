// ButtonComent.tsx
"use client";
import React, { useState } from "react";
import CommentTool, { Comment } from "../commentTool/CommentTool";

type ButtonComentProps = {
  role: "aluno" | "avaliador" | "coordenador";
  initialComments?: Comment[];
  onCommentChange?: (comments: Comment[]) => void;
};

const ButtonComent: React.FC<ButtonComentProps> = ({
  role,
  initialComments = [],
  onCommentChange,
}) => {
  const [adding, setAdding] = useState(false);
  const [, setComments] = useState<Comment[]>(initialComments);

  // Determinar se o usuário pode adicionar comentários com base na role
  const canAddComments = role === "avaliador" || role === "coordenador";

  const handleClick = () => {
    if (adding) {
      // Se já estiver no estado de adição, não faz nada
      return;
    }

    // Apenas avaliadores e coordenadores podem adicionar comentários
    if (!canAddComments) {
      return;
    }

    // Alterna para o estado "Feito"
    setAdding(true);
  };

  // Armazena os comentários atualizados e repassa para o componente pai
  const handleCommentChange = (updatedComments: Comment[]) => {
    setComments(updatedComments);
    if (onCommentChange) {
      onCommentChange(updatedComments);
    }
  };

  return (
    <div className="w-[30%] h-full absolute top-12 z-10">
      {canAddComments && (
        <button
          onClick={handleClick}
          className={`px-4 py-2 fixed z-20 top-[92%] right-[14%] transition-y-1/2 text-white rounded ${
            adding
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Adicionar comentário
        </button>
      )}

      <CommentTool
        adding={adding}
        setAdding={setAdding}
        role={role}
        initialComments={initialComments}
        onCommentChange={handleCommentChange}
      />
    </div>
  );
};

export default ButtonComent;
