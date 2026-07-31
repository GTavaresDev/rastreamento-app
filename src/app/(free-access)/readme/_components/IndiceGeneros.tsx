import { generosUnicos } from "../_mocks/livros";

export function IndiceGeneros() {
    return (
        <nav className="indice" aria-label="Índice de gêneros presentes no acervo">
            <span className="indice-titulo">Gêneros no acervo:</span>
            <div className="indice-janela">
                <div className="indice-faixa">
                    <ul className="indice-lista">
                        {generosUnicos.map((genero) => (
                            <li key={genero} className="indice-item">
                                {genero}
                            </li>
                        ))}
                    </ul>
                    <ul className="indice-lista" aria-hidden="true">
                        {generosUnicos.map((genero) => (
                            <li key={genero} className="indice-item">
                                {genero}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
