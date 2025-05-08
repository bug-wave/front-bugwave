// ButtonComent.tsx
"use client";
import React, { useState } from "react";
import CommentTool from "../commentTool/CommentTool";

const ButtonComent = () => {
  const [adding, setAdding] = useState(false);

  const handleStartAdd = () => {
    if (adding) return;
    setAdding(true);
  };

  return (
    <div className="abolute top-0 left-0 w-full h-full ">
      <button
        onClick={handleStartAdd}
        disabled={adding}
        className="px-4 py-2 absolute left-25 transition-y-1/2 top-1/6  bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Adicionar comentário
      </button>

      <CommentTool
        className="w-full h-full absolute top-0 left-0"
        adding={adding}
        setAdding={setAdding}
      />
    </div>
  );
};

export default ButtonComent;
