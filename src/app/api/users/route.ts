import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getAccessLevelName } from "@/lib/access-levels";
import { getAdminApiUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createUserSchema,
  getValidationError,
} from "@/lib/user-validation";

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

function unauthorized() {
  return NextResponse.json({ error: "Acesso não autorizado." }, { status: 403 });
}

export async function GET() {
  if (!(await getAdminApiUser())) return unauthorized();

  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: userSelect,
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  if (!(await getAdminApiUser())) return unauthorized();

  try {
    const result = createUserSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { error: getValidationError(result.error) },
        { status: 400 },
      );
    }

    const { password, ...data } = result.data;
    const permissionName = getAccessLevelName(data.permission)!;
    const user = await prisma.user.create({
      data: {
        ...data,
        password: await hash(password, 12),
        userPermission: {
          create: { name: permissionName },
        },
      },
      select: userSelect,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Já existe um usuário com este e-mail ou CPF." },
        { status: 409 },
      );
    }

    console.error("Falha ao criar usuário:", error);
    return NextResponse.json(
      { error: "Não foi possível criar o usuário." },
      { status: 500 },
    );
  }
}
