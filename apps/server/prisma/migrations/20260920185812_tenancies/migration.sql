-- CreateEnum
CREATE TYPE "TenancyRole" AS ENUM ('LANDLORD', 'TENANT');

-- CreateEnum
CREATE TYPE "Province" AS ENUM ('ON');

-- CreateTable
CREATE TABLE "Tenancy" (
    "id" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "unit" TEXT,
    "city" TEXT NOT NULL,
    "province" "Province" NOT NULL DEFAULT 'ON',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenancyMember" (
    "id" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TenancyRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TenancyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenancyMember_tenancyId_userId_key" ON "TenancyMember"("tenancyId", "userId");

-- AddForeignKey
ALTER TABLE "Tenancy" ADD CONSTRAINT "Tenancy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenancyMember" ADD CONSTRAINT "TenancyMember_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "Tenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenancyMember" ADD CONSTRAINT "TenancyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
