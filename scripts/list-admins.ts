import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Fetching all users with ADMIN role...");

    const adminUsers = await prisma.user.findMany({
        where: {
            roles: {
                some: {
                    role: {
                        name: "ADMIN"
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    if (adminUsers.length === 0) {
        console.log("No users found with ADMIN role.");
    } else {
        console.log(`Found ${adminUsers.length} admin(s):`);
        adminUsers.forEach(user => {
            console.log(`- ID: ${user.id} | Name: ${user.name} | Email: ${user.email}`);
        });
    }

    // Also check for lowercase "admin" just in case entries remained from before standardization
    const legacyAdmins = await prisma.user.findMany({
        where: {
            roles: {
                some: {
                    role: {
                        name: "admin"
                    }
                }
            }
        },
        select: {
            id: true,
            name: true,
            email: true
        }
    });

    if (legacyAdmins.length > 0) {
        console.log(`\n⚠️ Found ${legacyAdmins.length} legacy (lowercase) admin(s):`);
        legacyAdmins.forEach(user => {
            console.log(`- ID: ${user.id} | Name: ${user.name} | Email: ${user.email}`);
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
