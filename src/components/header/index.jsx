import React from "react";
import { PiggyBank } from "lucide-react";

export default function header() {
  return (
    <div className="min-w-screen flex items-center justify-center bg-white">
      <header className="backdrop-blur-md border-b border-slate-50 text-3xl font-bold flex items-center justify-center gap-2 m-4">
        <div className="bg-blue-600 p-3 rounded-lg flex flex-row items-center gap-2">
          <PiggyBank className="text-white" />
        </div>
        <span>Controle Financeiro</span>
      </header>
    </div>
  );
}
