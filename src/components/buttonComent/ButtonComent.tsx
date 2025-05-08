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
    <div className=" w-[30%] h-[250vh] absolute top-12 z-10">
      <button
        onClick={handleStartAdd}
        disabled={adding}
        className="px-4 py-2 absolute z-20 -left-[90%] top-96 transition-y-1/2  bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Adicionar comentário
      </button>

      <CommentTool adding={adding} setAdding={setAdding} />
    </div>
  );
};

export default ButtonComent;
