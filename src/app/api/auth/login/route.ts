import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().regex(/^[^\s@]+@[^\s@]+$/),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const result = loginSchema.safeParse(await request.json());

    if (!result.success) {
      return NextResponse.json(
        { error: "Informe e-mail e senha válidos." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
      include: { userPermission: true },
    });

    if (!user || !(await compare(result.data.password, user.password))) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 },
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        permission: user.permission,
        permissionName: user.userPermission?.name ?? "Sem permissão",
      },
    });
  } catch (error) {
    console.error("Falha no login:", error);
    return NextResponse.json(
      { error: "Não foi possível entrar. Tente novamente." },
      { status: 500 },
    );
  }
}
