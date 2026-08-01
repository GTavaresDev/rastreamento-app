import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getAccessLevelName } from "@/lib/access-levels";
import { getAdminApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getValidationError,
  updateUserSchema,
} from "@/lib/user-validation";

type RouteContext = { params: Promise<{ id: string }> };

const userSelect = {
  id: true,
  name: true,
  email: true,
  cpf: true,
  permission: true,
  createdAt: true,
  userPermission: {
    select: { id: true, name: true },
  },
} satisfies Prisma.UserSelect;

function parseId(rawId: string) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const admin = await getAdminApiUser();

  if (!admin) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  }

  try {
    const result = updateUserSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { error: getValidationError(result.error) },
        { status: 400 },
      );
    }

    const { password, ...data } = result.data;
    const permissionName = getAccessLevelName(data.permission)!;
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(password ? { password: await hash(password, 12) } : {}),
        userPermission: {
          upsert: {
            create: { name: permissionName },
            update: { name: permissionName },
          },
        },
      },
      select: userSelect,
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Já existe um usuário com este e-mail ou CPF." },
          { status: 409 },
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Usuário não encontrado." },
          { status: 404 },
        );
      }
    }

    console.error("Falha ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o usuário." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const admin = await getAdminApiUser();

  if (!admin) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
  }

  const id = parseId((await params).id);
  if (!id) {
    return NextResponse.json({ error: "Usuário inválido." }, { status: 400 });
  }

  if (id === admin.id) {
    return NextResponse.json(
      { error: "Você não pode excluir o usuário da sessão atual." },
      { status: 400 },
    );
  }

  try {
    await prisma.user.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    console.error("Falha ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o usuário." },
      { status: 500 },
    );
  }
}
