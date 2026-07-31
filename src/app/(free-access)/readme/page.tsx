import { Fraunces, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./readme.css";
import { livros } from "./_mocks/livros";
import { Cabecalho } from "./_components/Cabecalho";
import { IndiceGeneros } from "./_components/IndiceGeneros";
import { FichaLivro } from "./_components/FichaLivro";
import { NotaFinal } from "./_components/NotaFinal";
import { Rodape } from "./_components/Rodape";

const display = Fraunces({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "900"],
    style: ["normal", "italic"],
    variable: "--font-display",
});

const body = Source_Serif_4({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-body",
});

const mono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
});

export default function CatalogoBiblioteca() {
    return (
        <div
            className={`${display.variable} ${body.variable} ${mono.variable} pagina`}
            data-testid="catalogo-biblioteca"
        >
            <a href="#catalogo" className="pular-para-conteudo">
                Pular para o catálogo
            </a>

            <Cabecalho />
            <IndiceGeneros />

            <main id="catalogo" className="catalogo">
                <div className="catalogo-cabecalho">
                    <h2 className="catalogo-titulo">Ficha geral das obras</h2>
                    <p className="catalogo-legenda">
                        Ordenadas por número de tombo interno, do volume 01 ao volume 30.
                    </p>
                </div>

                <ol className="grade" data-total-livros={livros.length}>
                    {livros.map((livro) => (
                        <FichaLivro key={livro.id} livro={livro} />
                    ))}
                </ol>
            </main>

            <NotaFinal />
            <Rodape />
        </div>
    );
}