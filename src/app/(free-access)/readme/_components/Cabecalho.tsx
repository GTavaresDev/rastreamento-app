import {
    livros,
    generosUnicos,
    idiomasUnicos,
    totalPaginas,
    mediaAvaliacao,
    anoMaisAntigo,
    anoMaisRecente,
} from "../_mocks/livros";

export function Cabecalho() {
    return (
        <header className="cabecalho">
            <div className="cabecalho-interno">
                <div className="selo" aria-hidden="true">
                    <span>BIBLIOTECA</span>
                    <span>CENTRAL</span>
                </div>
                <p className="cabecalho-eyebrow">Acervo digital &mdash; ficha catalográfica geral</p>
                <h1 className="cabecalho-titulo">
                    Trinta volumes, <em>trinta mundos</em> encadernados
                </h1>
                <p className="cabecalho-descricao">
                    Este catálogo reúne trinta obras que atravessam séculos, línguas e
                    continentes — do sertão mineiro às ruas de Dublin, da corte
                    georgiana inglesa a uma favela paulistana. Cada ficha abaixo traz
                    autoria, ano de primeira publicação, editora original, número de
                    páginas, ISBN de referência e uma sinopse escrita para o leitor
                    que ainda não decidiu por onde começar.
                </p>
                <div className="cabecalho-stats">
                    <div className="stat">
                        <span className="stat-numero">{livros.length}</span>
                        <span className="stat-rotulo">obras catalogadas</span>
                    </div>
                    <div className="stat">
                        <span className="stat-numero">{generosUnicos.length}</span>
                        <span className="stat-rotulo">gêneros distintos</span>
                    </div>
                    <div className="stat">
                        <span className="stat-numero">{idiomasUnicos.length}</span>
                        <span className="stat-rotulo">idiomas originais</span>
                    </div>
                    <div className="stat">
                        <span className="stat-numero">{totalPaginas.toLocaleString("pt-BR")}</span>
                        <span className="stat-rotulo">páginas somadas</span>
                    </div>
                    <div className="stat">
                        <span className="stat-numero">{mediaAvaliacao}</span>
                        <span className="stat-rotulo">avaliação média</span>
                    </div>
                    <div className="stat">
                        <span className="stat-numero">
                            {anoMaisAntigo}&ndash;{anoMaisRecente}
                        </span>
                        <span className="stat-rotulo">intervalo de publicação</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
