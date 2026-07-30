export type StatusFilter =
  | "all"
  | "pedido"
  | "a_caminho"
  | "entregue"
  | "devolvido";

export const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "pedido", label: "Pedido" },
  { value: "a_caminho", label: "A caminho" },
  { value: "entregue", label: "Entregue" },
  { value: "devolvido", label: "Devolvido" },
];
