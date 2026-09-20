import type { Province } from "@prisma/client"
import { prisma } from "../db"

export async function createTenancy(input: {
  userId: string
  addressLine: string
  unit?: string
  city: string
  province: Province
}) {
  return prisma.tenancy.create({
    data: {
      addressLine: input.addressLine,
      unit: input.unit,
      city: input.city,
      province: input.province,
      createdById: input.userId,
      members: {
        create: {
          userId: input.userId,
          role: "LANDLORD"
        }
      }
    },
    include: {
      members: true
    }
  })
}

export async function listTenanciesForUser(userId: string) {
  return prisma.tenancy.findMany({
    where: {
      members: {
        some: { userId }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}