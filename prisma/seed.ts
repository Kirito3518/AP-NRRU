import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";
import { equipmentSeedRows } from "../src/test/fixtures/equipment-seed";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hash("admin1234", 12);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: { displayName: "ผู้ดูแลระบบ" },
    create: {
      username: "admin",
      displayName: "ผู้ดูแลระบบ",
      passwordHash,
      mustChangePassword: true,
    },
  });

  for (const row of equipmentSeedRows) {
    const department = row.department
      ? await prisma.department.upsert({
          where: { name: row.department },
          update: {},
          create: { name: row.department },
        })
      : null;
    const building = row.building
      ? await prisma.building.upsert({
          where: { name: row.building },
          update: {},
          create: { name: row.building },
        })
      : null;
    const deviceType = row.deviceType
      ? await prisma.deviceType.upsert({
          where: { name: row.deviceType },
          update: {},
          create: { name: row.deviceType },
        })
      : null;
    const owner = row.owner
      ? await prisma.owner.upsert({
          where: { name: row.owner },
          update: {},
          create: { name: row.owner },
        })
      : null;

    const data = {
      category: row.category,
      serialNumber: row.serialNumber,
      receivedYear: row.receivedYear,
      budgetSource: row.budgetSource,
      cpu: row.cpu,
      ram: row.ram,
      storage: row.storage,
      operatingSystem: row.operatingSystem,
      ipAddress: row.ipAddress,
      macAddress: row.macAddress,
      networkSpeed: row.networkSpeed,
      connectionStatus: row.connectionStatus,
      floor: row.floor,
      location: row.location,
      condition: row.condition,
      approximateAge: row.approximateAge,
      problem: row.problem,
      note: row.note,
      status: row.status,
      departmentId: department?.id ?? null,
      buildingId: building?.id ?? null,
      deviceTypeId: deviceType?.id ?? null,
      ownerId: owner?.id ?? null,
    };

    await prisma.equipment.upsert({
      where: { systemCode: row.systemCode },
      update: data,
      create: { systemCode: row.systemCode, ...data },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
