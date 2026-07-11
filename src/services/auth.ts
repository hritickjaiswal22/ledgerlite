import { hash, compare } from "bcrypt";
import { SignupBody, SigninBody, RefreshBody } from "../validators/auth";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

const SALT_ROUNDS = 10;

export async function signup(data: SignupBody) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) throw new AppError("User account already exists", 409);

  const validCurrencyId = await prisma.currency.findUnique({
    where: {
      id: data.selectedCurrencyId,
    },
  });

  if (!validCurrencyId) throw new AppError("Invalid data", 422);

  const hashedPassword = await hash(data.password, SALT_ROUNDS);

  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      selectedCurrencyId: data.selectedCurrencyId,
    },
  });

  return {
    refreshToken: generateRefreshToken({
      userId: newUser.id,
      selectedCurrencyId: newUser.selectedCurrencyId,
    }),
    accessToken: generateAccessToken({
      userId: newUser.id,
      selectedCurrencyId: newUser.selectedCurrencyId,
    }),
  };
}

export async function signin(data: SigninBody) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!existingUser) throw new AppError("User account does not exist", 401);

  const passwordCheck = await compare(data.password, existingUser.password);

  if (!passwordCheck) throw new AppError("Invalid email or password", 401);

  return {
    refreshToken: generateRefreshToken({
      userId: existingUser.id,
      selectedCurrencyId: existingUser.selectedCurrencyId,
    }),
    accessToken: generateAccessToken({
      userId: existingUser.id,
      selectedCurrencyId: existingUser.selectedCurrencyId,
    }),
  };
}

export async function refresh(data: RefreshBody) {
  try {
    const { selectedCurrencyId, userId } = verifyRefreshToken(
      data.refreshToken,
    );

    return {
      refreshToken: generateRefreshToken({
        userId,
        selectedCurrencyId,
      }),
      accessToken: generateAccessToken({
        userId,
        selectedCurrencyId,
      }),
    };
  } catch (error) {
    throw new AppError("Unauthorized", 401);
  }
}
