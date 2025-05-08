"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

export type Comment = {
  id: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
};

type CommentViewerProps = {
  className?: string;
  comments: Comment[];
};

const CommentViewer: React.FC<CommentViewerProps> = ({
  className,
  comments,
}) => {
  const [activeComment, setActiveComment] = useState<number | null>(null);

  // Fecha o comentário ativo se clicar fora dele
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveComment(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Evita propagação do clique para não fechar o comentário quando clicar nele
  const handleCommentClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveComment(activeComment === id ? null : id);
  };

  return (
    <div className={`absolute top-0 w-full h-full ${className || ""}`}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute group z-50"
          style={{ top: comment.y, left: comment.x }}
        >
          <div
            className="w-8 h-8 absolute z-50 bg-neutral-800 rounded-full flex items-center justify-center text-xl text-neutral-100 p-2 cursor-pointer hover:bg-neutral-700"
            onClick={(e) => handleCommentClick(e, comment.id)}
          >
            <FaUser />
            <div
              className={`w-auto max-w-[400px] h-auto absolute bottom-0 left-0 
                ${
                  activeComment === comment.id
                    ? "block"
                    : "hidden group-hover:block"
                } 
                bg-gray-800 text-white text-sm p-2 rounded-2xl rounded-bl-none 
                shadow-lg shadow-gray-500 whitespace-nowrap transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col justify-between items-center gap-2">
                <div className="w-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="w-full flex gap-2 items-center text-white">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xl text-slate-800">
                        <FaUser />
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="font-bold text-lg">
                          {comment.author}
                        </span>
                        <span className="font-semibold text-sm text-gray-300">
                          {comment.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 mt-2">
                    <div className="w-80 min-h-12 p-2 bg-gray-700 rounded text-white">
                      {comment.text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentViewer;
