import React from "react";
import "./index.css";
import Header from "./components/header";
import Home from "./components/home";
import ControleFinanceiro from "./components/ControleFinanceiro";
import Footer from "./components/footer";

export default function App() {
  return (
    <div className="App overflow-x-hidden">
      <Header />
      <Home />
      <ControleFinanceiro />
      <Footer />
    </div>
  );
}
