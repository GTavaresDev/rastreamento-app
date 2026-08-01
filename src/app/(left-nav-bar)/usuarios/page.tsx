import { requireAdminPage } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UsersManager } from "./_components/UsersManager";

export default async function UsuariosPage() {
  const admin = await requireAdminPage();
  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      permission: true,
      createdAt: true,
      userPermission: { select: { name: true } },
    },
  });

  return (
    <UsersManager
      currentUserId={admin.id}
      initialUsers={users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        permission: user.permission,
        permissionName: user.userPermission?.name ?? "Sem permissão",
        createdAt: user.createdAt.toISOString(),
      }))}
    />
  );
}
