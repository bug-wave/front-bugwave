/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import WebViewer from "@/components/pdf-viewer/WebViewer";

const page = () => {
  const router = useRouter();

  const goAluno = () => {
    router.push("/");
  };

  return (
      <div className="flex flex-col">
          <div className="">
              <WebViewer pdfUrl={"https://uploader-documents.s3.amazonaws.com/1746678461542-tarefafaltaluz.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY2ZZXWMZJFSZPEV3%2F20250508%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250508T042744Z&X-Amz-Expires=3600&X-Amz-Signature=9d9a3b236bba3e610fbad1d6482fc7cdab98644627be9eb9f37c5ee85b582daf&X-Amz-SignedHeaders=host"}/>
          </div>
          <button
              onClick={goAluno}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-900 hover:cursor-pointer w-10 h-10 rounded-lg"
          ></button>
      </div>
  );
};

export default page;
