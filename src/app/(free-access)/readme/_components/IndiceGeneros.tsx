import { generosUnicos } from "../_mocks/livros";

export function IndiceGeneros() {
    return (
        <nav className="indice" aria-label="Índice de gêneros presentes no acervo">
            <span className="indice-titulo">Gêneros no acervo:</span>
            <ul className="indice-lista">
                {generosUnicos.map((genero) => (
                    <li key={genero} className="indice-item">
                        {genero}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
