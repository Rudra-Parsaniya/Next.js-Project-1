import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const userId = 7;

    console.log(`🚀 Promoting user with ID ${userId} to ADMIN...`);

    // 1. Ensure the ADMIN role exists
    const adminRole = await prisma.role.upsert({
        where: { name: "ADMIN" },
        update: {},
        create: { name: "ADMIN" },
    });

    // 2. Assign the ADMIN role to the user
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: userId,
                roleId: adminRole.id,
            },
        },
        update: {},
        create: {
            userId: userId,
            roleId: adminRole.id,
        },
    });

    console.log(`✅ User with ID ${userId} is now an ADMIN.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
