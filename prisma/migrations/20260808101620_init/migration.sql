-- CreateEnum
CREATE TYPE "AccessPointStatus" AS ENUM ('ACTIVE', 'PROBLEM', 'MAINTENANCE', 'MOVED', 'MISSING', 'RETIRED');

-- CreateTable
CREATE TABLE "AccessPoint" (
    "id" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "deviceType" TEXT,
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "building" TEXT,
    "floor" TEXT,
    "location" TEXT,
    "department" TEXT,
    "owner" TEXT,
    "status" "AccessPointStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastCheckedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessPoint_assetCode_key" ON "AccessPoint"("assetCode");
