import { Livro } from "@/types/livro";
import { Estrelas } from "./Estrelas";

interface FichaLivroProps {
    livro: Livro;
}

export function FichaLivro({ livro }: FichaLivroProps) {
    return (
        <li className="ficha" data-livro-id={livro.id}>
            <div className="ficha-numero">{String(livro.id).padStart(2, "0")}</div>
            <div className="ficha-capa">
                <img
                    src={`https://picsum.photos/seed/${livro.seedImagem}/420/620`}
                    alt={`Capa do livro ${livro.titulo}, de ${livro.autor}`}
                    width={420}
                    height={620}
                    loading="lazy"
                    className="ficha-capa-imagem"
                />
                <span className="ficha-selo-genero">{livro.genero}</span>
            </div>
            <div className="ficha-corpo">
                <h3 className="ficha-titulo">{livro.titulo}</h3>
                <p className="ficha-autor">{livro.autor}</p>
                <p className="ficha-destaque">&ldquo;{livro.destaque}&rdquo;</p>
                <p className="ficha-sinopse">{livro.sinopse}</p>
                <dl className="ficha-metadados">
                    <div>
                        <dt>Ano</dt>
                        <dd>{livro.ano}</dd>
                    </div>
                    <div>
                        <dt>Páginas</dt>
                        <dd>{livro.paginas}</dd>
                    </div>
                    <div>
                        <dt>Idioma original</dt>
                        <dd>{livro.idioma}</dd>
                    </div>
                    <div>
                        <dt>Editora original</dt>
                        <dd>{livro.editora}</dd>
                    </div>
                    <div>
                        <dt>ISBN de referência</dt>
                        <dd className="ficha-isbn">{livro.isbn}</dd>
                    </div>
                </dl>
                <Estrelas nota={livro.avaliacao} />
            </div>
        </li>
    );
}
