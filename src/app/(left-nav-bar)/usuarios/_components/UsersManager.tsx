"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import {
  KeyRound,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ACCESS_LEVELS } from "@/lib/access-levels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { maskCpf } from "@core/domain/common/utils/formatters/cpf.formatter";
import { setStoredCpf, setStoredUserName } from "@core/infra/store/userStore";

type UserItem = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  permission: number;
  permissionName: string;
  createdAt: string;
};

type ApiUser = Omit<UserItem, "permissionName" | "createdAt"> & {
  createdAt: string;
  userPermission: { name: string } | null;
};

type UserForm = {
  name: string;
  email: string;
  cpf: string;
  password: string;
  permission: string;
};

const emptyForm: UserForm = {
  name: "",
  email: "",
  cpf: "",
  password: "",
  permission: "2",
};

function normalizeApiUser(user: ApiUser): UserItem {
  return {
    ...user,
    permissionName: user.userPermission?.name ?? "Sem permissão",
  };
}

export function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserItem[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase().replace(/\D/g, "");
    const textQuery = query.trim().toLowerCase();

    if (!textQuery) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(textQuery) ||
        user.email.toLowerCase().includes(textQuery) ||
        user.permissionName.toLowerCase().includes(textQuery) ||
        user.cpf.includes(normalizedQuery),
    );
  }, [query, users]);

  const adminCount = users.filter((user) => user.permission === 1).length;

  function updateForm(field: keyof UserForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function openCreateForm() {
    setEditingUser(null);
    setForm(emptyForm);
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(user: UserItem) {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      cpf: maskCpf(user.cpf),
      password: "",
      permission: String(user.permission),
    });
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) return;
    setIsFormOpen(false);
    setEditingUser(null);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        editingUser ? `/api/users/${editingUser.id}` : "/api/users",
        {
          method: editingUser ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            permission: Number(form.permission),
          }),
        },
      );
      const data = (await response.json()) as { user?: ApiUser; error?: string };

      if (!response.ok || !data.user) {
        setError(data.error ?? "Não foi possível salvar o usuário.");
        return;
      }

      const savedUser = normalizeApiUser(data.user);
      setUsers((current) =>
        editingUser
          ? current.map((user) => (user.id === savedUser.id ? savedUser : user))
          : [...current, savedUser].sort((a, b) => a.id - b.id),
      );
      if (savedUser.id === currentUserId) {
        setStoredUserName(savedUser.name);
        setStoredCpf(savedUser.cpf);
        router.refresh();
      }
      setNotice(editingUser ? "Usuário atualizado com sucesso." : "Usuário criado com sucesso.");
      setIsFormOpen(false);
      setEditingUser(null);
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(user: UserItem) {
    if (!window.confirm(`Excluir o usuário ${user.name}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingId(user.id);
    setNotice("");

    try {
      const response = await fetch(`/api/users/${user.id}`, { method: "DELETE" });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setNotice(data.error ?? "Não foi possível excluir o usuário.");
        return;
      }

      setUsers((current) => current.filter((item) => item.id !== user.id));
      setNotice("Usuário excluído com sucesso.");
    } catch {
      setNotice("Não foi possível conectar ao servidor.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="w-full space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Usuários</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie acessos, senhas e níveis de permissão do sistema.
          </p>
        </div>
        <Button size="lg" onClick={openCreateForm} className="rounded-xl">
          <Plus /> Novo usuário
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex-row items-center gap-4 p-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-950">{users.length}</p>
            <p className="text-xs font-medium text-slate-500">Usuários cadastrados</p>
          </div>
        </Card>
        <Card className="flex-row items-center gap-4 p-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-950">{adminCount}</p>
            <p className="text-xs font-medium text-slate-500">Administradores nível 1</p>
          </div>
        </Card>
      </div>

      {notice ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
          {notice}
        </div>
      ) : null}

      <Card className="gap-0 py-0">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">Lista de usuários</h2>
            <p className="text-xs text-slate-500">{filteredUsers.length} resultado(s)</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar nome, e-mail ou CPF"
              className="h-9 bg-slate-50 pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="px-4">Usuário</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="px-4 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                      {user.name.charAt(0).toUpperCase() || <UserRound />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.name}
                        {user.id === currentUserId ? (
                          <span className="ml-2 text-[10px] font-bold uppercase text-slate-400">Você</span>
                        ) : null}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{maskCpf(user.cpf)}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.permission === 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {user.permissionName}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Intl.DateTimeFormat("pt-BR").format(new Date(user.createdAt))}
                </TableCell>
                <TableCell className="px-4">
                  <UserActionsMenu
                    user={user}
                    canDelete={user.id !== currentUserId}
                    isDeleting={deletingId === user.id}
                    onEdit={() => openEditForm(user)}
                    onDelete={() => handleDelete(user)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <Card className="max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto p-0 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {editingUser ? "Editar usuário" : "Novo usuário"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingUser ? "Altere os dados ou informe uma nova senha." : "Preencha os dados para criar o acesso."}
                </p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={closeForm} title="Fechar">
                <X />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nome" htmlFor="user-name">
                  <Input id="user-name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} required maxLength={120} />
                </FormField>
                <FormField label="CPF" htmlFor="user-cpf">
                  <Input id="user-cpf" value={form.cpf} onChange={(event) => updateForm("cpf", maskCpf(event.target.value))} required inputMode="numeric" maxLength={14} placeholder="000.000.000-00" />
                </FormField>
              </div>

              <FormField label="E-mail" htmlFor="user-email">
                <Input id="user-email" type="email" value={form.email} onChange={(event) => updateForm("email", event.target.value)} required maxLength={255} />
              </FormField>

              <FormField label={editingUser ? "Nova senha (opcional)" : "Senha"} htmlFor="user-password">
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="user-password" type="password" value={form.password} onChange={(event) => updateForm("password", event.target.value)} required={!editingUser} minLength={form.password ? 6 : undefined} maxLength={72} className="pl-10" autoComplete="new-password" />
                </div>
              </FormField>

              <FormField label="Nível de acesso" htmlFor="user-permission">
                <select
                  id="user-permission"
                  value={form.permission}
                  onChange={(event) => updateForm("permission", event.target.value)}
                  required
                  className="h-11 w-full cursor-pointer rounded-xl border border-input bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {ACCESS_LEVELS.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <p className="rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
                Somente usuários com nível de acesso Administrador podem acessar esta área.
              </p>

              {error ? <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700">{error}</p> : null}

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSaving}>Cancelar</Button>
                <Button type="submit" disabled={isSaving}>{isSaving ? "Salvando..." : "Salvar usuário"}</Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

function UserActionsMenu({
  user,
  canDelete,
  isDeleting,
  onEdit,
  onDelete,
}: {
  user: UserItem;
  canDelete: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end">
      <Menu.Root>
        <Menu.Trigger
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
          aria-label={`Ações do usuário ${user.name}`}
          title="Ações"
        >
          <MoreVertical className="size-4" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={6} align="end" className="z-50 outline-none">
            <Menu.Popup className="w-44 origin-(--transform-origin) rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-xl outline-none transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <Menu.Item
                onClick={onEdit}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 outline-none data-highlighted:bg-slate-100 data-highlighted:text-slate-950"
              >
                <Pencil className="size-4" />
                Editar usuário
              </Menu.Item>
              <Menu.Item
                onClick={onDelete}
                disabled={!canDelete || isDeleting}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-red-600 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:bg-red-50"
              >
                <Trash2 className="size-4" />
                {isDeleting ? "Excluindo..." : "Excluir usuário"}
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
