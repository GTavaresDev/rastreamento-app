import { livros } from "../_mocks/livros";

export function Rodape() {
    return (
        <footer className="rodape">
            <p>Catálogo gerado para fins de teste e demonstração de layout.</p>
            <p className="rodape-mono">
                total_registros={livros.length} · gerado_em=
                {new Date().getFullYear()}
            </p>
        </footer>
    );
}
