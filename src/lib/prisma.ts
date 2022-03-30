import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(<any>global).prisma) {
    (<any>global).prisma = new PrismaClient();
  }
  prisma = (<any>global).prisma;
}

export default prisma;
