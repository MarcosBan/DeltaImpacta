import "./Auth.css"
import React, { useState } from "react"

export default function (props) {
  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Delta</h3>
            <div className="text-center">
              Ainda não possui cadastro?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Cadastre-se
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Endereço de Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Insira seu email"
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Insira sua senha"
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Acessar
              </button>
            </div>
            </div>
        </form>
      </div>
    )
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Delta - Cadastre-se</h3>
          <div className="text-center">
            Já Possui cadastro?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Acessar
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Nome Completo</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="e.x Mario da Silva"
            />
          </div>
          <div className="form-group mt-3">
            <label>Data de Nascimento</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="12/07/1990"
            />
          </div>
          <div className="form-group mt-3">
            <label>Endereço de E-mail</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Endereço de E-mail"
            />
          </div>
          <div className="form-group mt-3">
            <label>Senha</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Senha"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Acessar
            </button>
          </div>
          </div>
      </form>
    </div>
  )
}