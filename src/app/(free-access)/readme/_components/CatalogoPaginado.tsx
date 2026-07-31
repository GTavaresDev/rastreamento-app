"use client";

import { useRef, useState } from "react";
import { livros } from "../_mocks/livros";
import { FichaLivro } from "./FichaLivro";

const LIVROS_POR_PAGINA = 6;

export function CatalogoPaginado() {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const gradeRef = useRef<HTMLOListElement>(null);
    const totalPaginas = Math.ceil(livros.length / LIVROS_POR_PAGINA);
    const primeiroLivro = (paginaAtual - 1) * LIVROS_POR_PAGINA;
    const livrosVisiveis = livros.slice(
        primeiroLivro,
        primeiroLivro + LIVROS_POR_PAGINA
    );

    function irParaPagina(pagina: number) {
        if (pagina === paginaAtual || pagina < 1 || pagina > totalPaginas) {
            return;
        }

        setPaginaAtual(pagina);
        gradeRef.current?.scrollIntoView({ block: "start" });
    }

    return (
        <>
            <p className="paginacao-status" aria-live="polite">
                Exibindo {primeiroLivro + 1}–
                {Math.min(primeiroLivro + LIVROS_POR_PAGINA, livros.length)} de{" "}
                {livros.length} livros
            </p>

            <ol
                ref={gradeRef}
                className="grade"
                data-total-livros={livros.length}
                data-pagina-atual={paginaAtual}
            >
                {livrosVisiveis.map((livro) => (
                    <FichaLivro key={livro.id} livro={livro} />
                ))}
            </ol>

            <nav className="paginacao" aria-label="Paginação do catálogo">
                <button
                    type="button"
                    className="paginacao-botao paginacao-botao-texto"
                    onClick={() => irParaPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                >
                    ← Anterior
                </button>

                <div className="paginacao-paginas">
                    {Array.from({ length: totalPaginas }, (_, indice) => {
                        const pagina = indice + 1;

                        return (
                            <button
                                key={pagina}
                                type="button"
                                className="paginacao-botao"
                                aria-label={`Ir para a página ${pagina}`}
                                aria-current={paginaAtual === pagina ? "page" : undefined}
                                onClick={() => irParaPagina(pagina)}
                            >
                                {pagina}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className="paginacao-botao paginacao-botao-texto"
                    onClick={() => irParaPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                >
                    Próxima →
                </button>
            </nav>
        </>
    );
}
