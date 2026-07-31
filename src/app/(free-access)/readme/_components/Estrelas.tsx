interface EstrelasProps {
    nota: number;
}

export function Estrelas({ nota }: EstrelasProps) {
    const cheias = Math.floor(nota);
    const meia = nota - cheias >= 0.5;
    return (
        <span aria-label={`Avaliação ${nota} de 5`} className="estrelas">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="estrela">
                    {i < cheias ? "★" : i === cheias && meia ? "⯨" : "☆"}
                </span>
            ))}
            <span className="estrela-numero">{nota.toFixed(1)}</span>
        </span>
    );
}
