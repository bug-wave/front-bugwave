// CommentTool.tsx
"use client";
import React from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";

export type Comment = {
  id: number;
  x: number;
  y: number;
  text: string;
};

type CommentToolProps = {
  className?: string;
  adding: boolean;
  setAdding: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentTool: React.FC<CommentToolProps> = ({
  className,
  adding,
  setAdding,
}) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [tempPos, setTempPos] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const [tempText, setTempText] = React.useState("");
  const [editActive, setEditActive] = React.useState(false);

  const handleClickArea = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!adding || tempPos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTempPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDone = () => {
    if (tempPos && tempText.trim()) {
      setComments((prev) => [
        ...prev,
        { id: Date.now(), ...tempPos, text: tempText },
      ]);
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
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditActive(true);
    if (adding || editingId !== null) return;
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;
    setEditingId(id);
    setTempText(comment.text);
    setTempPos({ x: comment.x, y: comment.y });
  };

  const handleSaveEdit = () => {
    setEditActive(false);
    if (editingId === null || !tempText.trim()) return;
    setComments((prev) =>
      prev.map((c) => (c.id === editingId ? { ...c, text: tempText } : c))
    );
    cancelTemp();
  };

  return (
    <div
      className={`absolute w-full h-full top-0 left-0 ${
        adding == false ? "z-0" : "z-50"
      }  ${className || ""}`}
      onClick={handleClickArea}
    >
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute group z-50"
          style={{ top: comment.y, left: comment.x }}
        >
          <div
            className={`w-8 h-8 absolute z-50 ${
              editActive ? "bg-transparent" : "bg-neutral-800"
            } rounded-full flex items-center justify-center text-xl text-neutral-100 relative p-2`}
          >
            <FaUser />
            <div className="w-auto max-w-[800px] h-auto absolute bottom-0 left-0 hidden group-hover:block bg-gray-800 text-black text-sm p-2 rounded-2xl rounded-bl-none shadow-lg shadow-gray-500 whitespace-nowrap transition-all duration-300">
              <div className="flex flex-col justify-between items-center gap-2">
                <div className="w-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="w-2/3 flex gap-2 items-center text-white">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xl text-slate-800">
                        <FaUser />
                      </span>
                      <div className="flex items-end gap-2">
                        <span className="font-bold text-lg">userName</span>
                        <span className="font-semibold">time</span>
                      </div>
                    </div>
                    <div className="flex gap-2 w-1/3 justify-end">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className=" hover:cursor-pointer text-white hover:text-yellow-500 text-lg"
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
                  </div>
                  <div className="p-2">
                    <textarea
                      disabled
                      value={comment.text}
                      className="w-80 min-h-12 h-24 p-2 border rounded resize-none text-white border-none shadow-none"
                      placeholder="Digite seu comentário"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {(adding || editingId !== null) && tempPos && (
        <div
          className="absolute z-20"
          style={{ top: tempPos.y, left: tempPos.x }}
        >
          <textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            className="w-48 h-24 p-2 border rounded shadow resize-none"
            placeholder="Digite seu comentário"
          />
          <div className="flex justify-end mt-1 gap-2">
            <button
              onClick={cancelTemp}
              className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={editingId !== null ? handleSaveEdit : handleDone}
              className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              Feito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTool;
