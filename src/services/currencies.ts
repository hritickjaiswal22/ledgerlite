import { prisma } from "../lib/prisma";

export async function getAllCurrencies() {
  const currencies = await prisma.currency.findMany({
    select: {
      code: true,
      symbol: true,
      id: true,
      name: true,
    },
  });

  return currencies;
}
