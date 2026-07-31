import { Livro } from "@/types/livro";
import livrosJson from "./livros.json";

export const livros: Livro[] = livrosJson as Livro[];

export const generosUnicos = Array.from(new Set(livros.map((l) => l.genero)));
export const idiomasUnicos = Array.from(new Set(livros.map((l) => l.idioma)));
export const totalPaginas = livros.reduce((acc, l) => acc + l.paginas, 0);
export const mediaAvaliacao = (
    livros.reduce((acc, l) => acc + l.avaliacao, 0) / livros.length
).toFixed(2);
export const anoMaisAntigo = Math.min(...livros.map((l) => l.ano));
export const anoMaisRecente = Math.max(...livros.map((l) => l.ano));
