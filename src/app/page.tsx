"use client";
// Se estiver usando o App Router do Next.js (pasta app/)
import "boxicons/css/boxicons.min.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goAluno = () => {
    router.push("private/alunos/home");
  };
  const goCord = () => {
    router.push("private/avaliador/home");
  };
  const goAval = () => {
    router.push("private/coordenador/home");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-900 gap-2 text-white font-semibold">
      <button
        onClick={goAluno}
        className="px-4 py-2 bg-blue-800 hover:bg-blue-900 hover:cursor-pointer rounded-lg"
      >
        Aluno
      </button>
      <button
        onClick={goCord}
        className="px-4 py-2 bg-red-800  hover:bg-red-900 hover:cursor-pointer rounded-lg"
      >
        Avaliador
      </button>
      <button
        onClick={goAval}
        className="px-4 py-2 bg-yellow-800  hover:bg-yellow-900 hover:cursor-pointer rounded-lg"
      >
        Coordenador
      </button>
    </div>
  );
}
