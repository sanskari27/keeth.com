import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;

export const accountDB = prisma.account;
export const sessionDB = prisma.session;
export const cartItemDB = prisma.cartItem;
export const productDB = prisma.product;
