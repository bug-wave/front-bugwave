/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import WebViewer from "../../../../components/pdf-viewer/WebViewer";

interface EventItem {
    title: string
}

const page = () => {
  const router = useRouter();

  const eventMock: EventItem[] = [
      {
          title: "Semana Acadêmica - Engenharia de Software"
      },
      {
          title: "Semana Acadêmica - Analise de Sistemas"
      },
      {
          title: "Semana Acadêmica - Engenharia de Software"
      },
      {
          title: "Semana Acadêmica - Analise de Sistemas"
      },
      {
          title: "Semana Acadêmica - Engenharia de Software"
      },
      {
          title: "Semana Acadêmica - Analise de Sistemas"
      },
      {
          title: "Semana Acadêmica - Engenharia de Software"
      },
      {
          title: "Semana Acadêmica - Analise de Sistemas"
      }
  ]

  const goAluno = () => {
    router.push("/");
  };

  const eventPage = (item: EventItem) => {

  }

  return (
      <div className="flex flex-col bg-gray-200 h-[100vh]">
          <div className="h-12 bg-[#304358]">
              <button
                  onClick={goAluno}
                  className="px-4 py-2 bg-[#304358] text-white font-semibold hover:cursor-pointer w-fit h-10 rounded-lg"
              >Voltar</button>
          </div>
          <div className="ml-96 mr-96 mt-32">
              <h1 className="font-bold text-[#304358] text-xl">Eventos Disponíveis</h1>

              <div className="h-fit grid grid-cols-2 gap-6 max-h-[600px] overflow-y-auto p-6">
                  {eventMock.map((item, index) => (
                      <div className="p-6 bg-white rounded-2xl max-w-96 flex cursor-pointer
                        transition-all hover:scale-105" onClick={eventPage} key={index}>
                          <div className="w-48 h-24 rounded-xl mr-3 bg-gray-300">
                          </div>
                          <div className="flex flex-col justify-center">
                              <h1 className="font-semibold">{item.title}</h1>
                          </div>
                      </div>
                  ))}
              </div>
          </div>



      </div>
  );
};

export default page;
