import React, { useState, useMemo, useEffect } from "react";

// Componente Balanca (sem alterações)
function Balanca({ balance }) {
  return (
    <section className="mb-12 rounded-lg border shadow-sm bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
      <div className="flex flex-col space-y-1.5 p-6">
        <h1 className="text-center text-2xl font-semibold leading-none tracking-tight text-slate-800">
          Current Balance
        </h1>
      </div>
      <div className="p-6 pt-0 text-center">
        <div
          className={`text-4xl font-bold mb-2 ${
            balance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          R${" "}
          {Math.abs(balance).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </section>
  );
}

export default function ControleFinanceiro() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("financialControlTransactions")) || []
  );

  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "Recebido",
  });

  const [showSalaryPopup, setShowSalaryPopup] = useState(false);
  const [initialSalaryInput, setInitialSalaryInput] = useState("");

  // --- Novos estados para o pop-up de edição de salário ---
  const [showEditSalaryPopup, setShowEditSalaryPopup] = useState(false);
  const [editSalaryInput, setEditSalaryInput] = useState("");

  // Efeito para carregar transações e verificar o salário inicial (já existente)
  useEffect(() => {
    const salaryExists = transactions.some((t) => t.id === "salary-initial");
    if (!salaryExists) {
      setShowSalaryPopup(true);
    }
  }, [transactions]);

  // Efeito para sincronizar 'transactions' com o Local Storage (já existente)
  useEffect(() => {
    localStorage.setItem(
      "financialControlTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const currentBalance = useMemo(() => {
    let totalReceived = 0;
    let totalFixedExpenses = 0;
    let totalVariableExpenses = 0;

    transactions.forEach((t) => {
      if (t.type === "Recebido") {
        totalReceived += t.amount;
      } else if (t.type === "Gasto Fixo") {
        totalFixedExpenses += t.amount;
      } else if (t.type === "Gasto Variável") {
        totalVariableExpenses += t.amount;
      }
    });

    return totalReceived - totalFixedExpenses - totalVariableExpenses;
  }, [transactions]);

  const handleAddTransaction = () => {
    if (!newTransaction.description.trim() || newTransaction.amount <= 0) {
      alert("Por favor, preencha a descrição e o valor da transação.");
      return;
    }

    const transactionToAdd = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...newTransaction,
    };

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      transactionToAdd,
    ]);

    setNewTransaction({
      description: "",
      amount: "",
      type: "Recebido",
    });
  };

  const handleDeleteTransaction = (id) => {
    if (id === "salary-initial") {
      alert(
        "O salário inicial não pode ser excluído diretamente. Use o botão 'Editar Salário' para alterá-lo."
      );
      return;
    }
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
  };

  const handleSetInitialSalary = () => {
    const salary = parseFloat(initialSalaryInput);

    if (isNaN(salary) || salary <= 0) {
      alert("Por favor, insira um valor de salário válido e maior que zero.");
      return;
    }

    const salaryTransaction = {
      id: "salary-initial",
      description: "Salário Inicial",
      amount: salary,
      type: "Recebido",
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions((prevTransactions) => {
      const existingTransactionsWithoutSalary = prevTransactions.filter(
        (t) => t.id !== "salary-initial"
      );
      return [salaryTransaction, ...existingTransactionsWithoutSalary];
    });

    setShowSalaryPopup(false);
  };

  // --- Função para abrir o pop-up de edição e preencher com o valor atual do salário ---
  const handleOpenEditSalary = () => {
    const salaryTransaction = transactions.find(
      (t) => t.id === "salary-initial"
    );
    if (salaryTransaction) {
      setEditSalaryInput(salaryTransaction.amount.toString()); // Preenche o input com o valor atual
      setShowEditSalaryPopup(true);
    }
  };

  // --- Função para salvar o salário editado ---
  const handleSaveEditedSalary = () => {
    const newSalary = parseFloat(editSalaryInput);

    if (isNaN(newSalary) || newSalary <= 0) {
      alert("Por favor, insira um valor de salário válido e maior que zero.");
      return;
    }

    setTransactions((prevTransactions) => {
      // Mapeia as transações e atualiza a transação de salário se o ID corresponder
      return prevTransactions.map((t) =>
        t.id === "salary-initial"
          ? {
              ...t,
              amount: newSalary,
              date: new Date().toISOString().split("T")[0],
            } // Atualiza valor e data
          : t
      );
    });

    setShowEditSalaryPopup(false); // Fecha o pop-up de edição
  };

  // --- Função para cancelar a edição do salário ---
  const handleCancelEditSalary = () => {
    setShowEditSalaryPopup(false);
    setEditSalaryInput(""); // Limpa o input
  };

  return (
    <div className="p-4 max-w-full mx-auto md:px-8">
      {/* Pop-up de Salário Inicial (para a primeira vez) */}
      {showSalaryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-4">Bem-vindo(a)!</h2>
            <p className="mb-4">Para começar, qual é o seu salário mensal?</p>
            <input
              type="number"
              placeholder="Digite seu salário"
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              value={initialSalaryInput}
              onChange={(e) => setInitialSalaryInput(e.target.value)}
              min="0"
            />
            <button
              onClick={handleSetInitialSalary}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Definir Salário
            </button>
          </div>
        </div>
      )}

      {/* NOVO: Pop-up de Edição de Salário */}
      {showEditSalaryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-4">
              Editar Salário Mensal
            </h2>
            <p className="mb-4">Insira o novo valor do seu salário:</p>
            <input
              type="number"
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              value={editSalaryInput} // Liga ao novo estado de edição
              onChange={(e) => setEditSalaryInput(e.target.value)}
              min="0"
            />
            <div className="flex justify-end gap-2">
              {" "}
              {/* Botões de ação */}
              <button
                onClick={handleSaveEditedSalary}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Salvar
              </button>
              <button
                onClick={handleCancelEditSalary}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Balanca balance={currentBalance} />

      <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
        <div className="rounded-lg border shadow-sm flex-1 w-full h-full flex flex-col">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Adicionar Nova Transação
            </h2>
            <p className="text-sm text-muted-foreground">
              Registre suas receitas ou despesas.
            </p>
          </div>
          <div className="p-6 pt-0 flex-grow">
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Valor
                </label>
                <input
                  type="number"
                  id="amount"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={
                    newTransaction.amount === 0 ? "" : newTransaction.amount
                  }
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: parseFloat(e.target.value) || "",
                    })
                  }
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="Recebido">Recebido</option>
                  <option value="Gasto Fixo">Gasto Fixo</option>
                  <option value="Gasto Variável">Gasto Variável</option>
                </select>
              </div>
              <button
                onClick={handleAddTransaction}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Adicionar Transação
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm flex-1 w-full h-full flex flex-col overflow-auto">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Histórico de Transações
            </h2>
          </div>
          <div className="p-6 pt-0 flex-grow">
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhuma transação registrada ainda.
              </p>
            ) : (
              <ul>
                {transactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold">{t.description}</p>
                      <p className="text-sm text-gray-500">
                        {t.date} - {t.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          t.type === "Recebido"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.type === "Recebido" ? "+" : "-"} R${" "}
                        {t.amount.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      {/* Botão de Edição de Salário */}
                      {/* Só mostra o botão se a transação for o salário inicial */}
                      {t.id === "salary-initial" && (
                        <button
                          onClick={handleOpenEditSalary} // Chama a função para abrir o pop-up de edição
                          className="ml-2 text-gray-500 hover:text-gray-700 text-sm font-semibold p-1 rounded hover:bg-gray-100"
                          title="Editar salário"
                        >
                          &#x270E; {/* Símbolo de lápis (caneta) para edição */}
                        </button>
                      )}
                      {/* Botão de Excluir (mantém a lógica anterior, só para outras transações) */}
                      {t.id !== "salary-initial" && (
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          title="Excluir transação"
                        >
                          &#x2715;
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
