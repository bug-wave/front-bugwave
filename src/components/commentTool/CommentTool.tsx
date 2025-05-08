// CommentTool.tsx
"use client";
import React, { useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";

export type Comment = {
  id: number;
  x: number;
  y: number;
  text: string;
  author?: string;
  timestamp?: string;
};

type UserRole = "aluno" | "avaliador" | "coordenador";

type CommentToolProps = {
  className?: string;
  adding: boolean;
  setAdding: React.Dispatch<React.SetStateAction<boolean>>;
  role: UserRole;
  initialComments?: Comment[];
  onCommentChange?: (comments: Comment[]) => void;
};

const CommentTool: React.FC<CommentToolProps> = ({
  className,
  adding,
  setAdding,
  role,
  initialComments = [],
  onCommentChange,
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [comments, setComments] = React.useState<Comment[]>(initialComments);
  const [tempPos, setTempPos] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const [tempText, setTempText] = React.useState("");
  const [editActive, setEditActive] = React.useState(false);

  // Capacidade de edição baseada no papel (role) do usuário
  const canEdit = role === "avaliador" || role === "coordenador";

  // Atualizar estado de comentários quando os comentários iniciais mudarem
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // Callback para notificar o componente pai quando os comentários mudarem
  const notifyCommentChange = useCallback(
    (updatedComments: Comment[]) => {
      if (onCommentChange) {
        onCommentChange(updatedComments);
      }
    },
    [onCommentChange]
  );

  // Atualizar componente pai quando os comentários mudarem
  useEffect(() => {
    notifyCommentChange(comments);
  }, [comments, notifyCommentChange]);

  const handleClickArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canEdit || !adding || tempPos) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setTempPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDone = () => {
    if (!canEdit) return;

    if (tempPos && tempText.trim()) {
      const newComment = {
        id: Date.now(),
        ...tempPos,
        text: tempText,
        author: role === "avaliador" ? "Avaliador" : "Coordenador",
        timestamp: new Date().toLocaleString("pt-BR"),
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      notifyCommentChange(updatedComments);
    }
    cancelTemp();
  };

  const cancelTemp = () => {
    setAdding(false);
    setEditingId(null);
    setTempPos(null);
    setTempText("");
    setEditActive(false);
  };

  const handleDelete = (id: number) => {
    if (!canEdit) return;

    const updatedComments = comments.filter((c) => c.id !== id);
    setComments(updatedComments);
    notifyCommentChange(updatedComments);
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    if (!canEdit) return;

    e.stopPropagation(); // Evita que o clique se propague
    setEditActive(true);
    if (adding || editingId !== null) return;

    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    setEditingId(id);
    setTempText(comment.text);
    setTempPos({ x: comment.x, y: comment.y });
  };

  const handleSaveEdit = () => {
    if (!canEdit) return;

    setEditActive(false);
    if (editingId === null || !tempText.trim()) return;

    const updatedComments = comments.map((c) =>
      c.id === editingId
        ? {
            ...c,
            text: tempText,
            timestamp: new Date().toLocaleString("pt-BR"),
          }
        : c
    );

    setComments(updatedComments);
    notifyCommentChange(updatedComments);
    cancelTemp();
  };

  return (
    <div
      className={`absolute top-0 w-full h-full ${className || ""}`}
      onClick={canEdit ? handleClickArea : undefined}
    >
      {comments.map((comment, index) => (
        <div
          key={index}
          className="absolute group z-50"
          style={{ top: comment.y, left: comment.x }}
        >
          <div
            className={`w-8 h-8 absolute z-50 ${
              editActive ? "bg-transparent" : "bg-neutral-800"
            } rounded-full flex items-center justify-center text-xl text-neutral-100 relative p-2 cursor-pointer`}
          >
            <FaUser />
            <div className="w-auto max-w-[800px] h-auto absolute bottom-0 left-0 hidden group-hover:block bg-gray-800 text-black text-sm p-2 rounded-2xl rounded-bl-none shadow-lg shadow-gray-500 whitespace-nowrap transition-all duration-300">
              <div className="flex flex-col justify-between items-center gap-2">
                <div className="w-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="w-full flex gap-2 items-center text-white p-2">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xl text-slate-800">
                        <FaUser />
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="font-bold text-lg">
                          {comment.author || "Usuário"}
                        </span>
                        <span className="font-semibold">
                          {comment.timestamp || "Agora"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 ">
                    <textarea
                      disabled
                      value={comment.text}
                      className="w-80 min-h-12 h-24 p-2 border rounded resize-none text-white border-none shadow-none bg-gray-700"
                      placeholder="Digite seu comentário"
                    />
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 w-full justify-end p-2">
                      <button
                        onClick={(e) => handleEdit(comment.id, e)}
                        className="hover:cursor-pointer text-white hover:text-yellow-500 text-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="hover:cursor-pointer text-white hover:text-red-500 text-lg"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {canEdit && (adding || editingId !== null) && tempPos && (
        <div
          className="absolute z-20 bg-gray-800 text-white p-2 rounded-bl-none rounded-xl"
          style={{ top: tempPos.y, left: tempPos.x }}
        >
          <textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            className="w-48 h-24 p-2 border rounded resize-none outline-none border-none shadow-none bg-gray-700"
            placeholder="Digite seu comentário"
            autoFocus
          />
          <div className="flex justify-end mt-1 gap-2">
            <button
              onClick={cancelTemp}
              className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-700"
            >
              Cancelar
            </button>
            <button
              onClick={editingId !== null ? handleSaveEdit : handleDone}
              className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              {editingId !== null ? "Salvar" : "Feito"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTool;
