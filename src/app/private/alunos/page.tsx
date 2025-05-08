/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const goAluno = () => {
    router.push("/");
  };

  return (
    <div>
      <button
        onClick={goAluno}
        className="px-4 py-2 bg-blue-800 hover:bg-blue-900 hover:cursor-pointer rounded-lg"
      ></button>
    </div>
  );
};

export default page;
