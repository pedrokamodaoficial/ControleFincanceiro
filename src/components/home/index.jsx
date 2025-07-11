import React from "react";
import { Button } from "react";
import { BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Conheça Agora
            <span className="text-blue-600 block">
              Como Cuidar Bem do Seu Dinheiro
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Mantenha sua saúde financeira atualizada sem sair de casa. Organize
            seus gastos e acompanhe seus resultados de maneira simples e
            eficiente. <span className="text-blue-600">Conheça agora!</span>
          </p>
        </div>
      </div>
    </section>
  );
}
