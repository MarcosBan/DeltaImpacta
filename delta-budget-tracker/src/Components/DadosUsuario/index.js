import Botao from "../Botao"
import CampoTexto from "../CampoTexto"
import "./DadosUsuario.css"

const DadosUsuario = (props) => {
    return (
        <section className="formularioUsuario">
            <form>
                <h2>Dados do usuário</h2>
                <CampoTexto label="Usuario" placeholder="caina.tavares" />
                <CampoTexto label="Data de Nascimento" placeholder="12/07/1990" />
                <CampoTexto label="Senha" placeholder="******" />
                <Botao>Salvar</Botao>
            </form>
        </section>
    )
}

export default DadosUsuario