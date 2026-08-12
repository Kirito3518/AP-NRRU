CREATE TYPE "EquipmentStatus" AS ENUM ('ACTIVE', 'PROBLEM', 'MAINTENANCE', 'MOVED', 'MISSING', 'RETIRED');
CREATE TYPE "EquipmentHistoryAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED');
ALTER TABLE "AccessPoint" DROP CONSTRAINT "AccessPoint_buildingId_fkey";
ALTER TABLE "AccessPoint" DROP CONSTRAINT "AccessPoint_departmentId_fkey";
ALTER TABLE "AccessPoint" DROP CONSTRAINT "AccessPoint_deviceTypeId_fkey";
ALTER TABLE "AccessPoint" DROP CONSTRAINT "AccessPoint_ownerId_fkey";
ALTER TABLE "AccessPoint" DROP CONSTRAINT "AccessPoint_updatedById_fkey";
DROP INDEX "Session_token_idx";
DROP INDEX "Session_token_key";
ALTER TABLE "DeviceType" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Session" DROP COLUMN "token", ADD COLUMN "tokenHash" TEXT NOT NULL;
ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT true;
DROP TABLE "AccessPoint";
DROP TYPE "AccessPointStatus";
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "systemCode" TEXT NOT NULL,
    "assetCode" TEXT,
    "category" TEXT,
    "serialNumber" TEXT,
    "receivedYear" TEXT,
    "budgetSource" TEXT,
    "cpu" TEXT,
    "ram" TEXT,
    "storage" TEXT,
    "operatingSystem" TEXT,
    "ipAddress" TEXT,
    "macAddress" TEXT,
    "networkSpeed" TEXT,
    "connectionStatus" TEXT,
    "floor" TEXT,
    "room" TEXT,
    "location" TEXT,
    "condition" TEXT,
    "approximateAge" TEXT,
    "problem" TEXT,
    "recommendation" TEXT,
    "note" TEXT,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "departmentId" TEXT,
    "buildingId" TEXT,
    "deviceTypeId" TEXT,
    "ownerId" TEXT,
    "updatedById" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "EquipmentHistory" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "action" "EquipmentHistoryAction" NOT NULL,
    "changes" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EquipmentHistory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Equipment_systemCode_key" ON "Equipment"("systemCode");
CREATE UNIQUE INDEX "Equipment_assetCode_key" ON "Equipment"("assetCode");
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");
CREATE INDEX "Equipment_departmentId_idx" ON "Equipment"("departmentId");
CREATE INDEX "Equipment_buildingId_idx" ON "Equipment"("buildingId");
CREATE INDEX "Equipment_deviceTypeId_idx" ON "Equipment"("deviceTypeId");
CREATE INDEX "Equipment_deletedAt_idx" ON "Equipment"("deletedAt");
CREATE INDEX "EquipmentHistory_equipmentId_createdAt_idx" ON "EquipmentHistory"("equipmentId", "createdAt");
CREATE INDEX "EquipmentHistory_userId_idx" ON "EquipmentHistory"("userId");
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");
CREATE UNIQUE INDEX "DeviceType_name_key" ON "DeviceType"("name");
CREATE UNIQUE INDEX "Owner_name_key" ON "Owner"("name");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_tokenHash_idx" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_deviceTypeId_fkey" FOREIGN KEY ("deviceTypeId") REFERENCES "DeviceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Equipment" ADD CONSTRAINT "Equipment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
