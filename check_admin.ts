import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const roles = await prisma.role.findMany();
    console.log("Roles:", JSON.stringify(roles, null, 2));

    const users = await prisma.user.findMany({
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    });

    console.log("Users and their roles:");
    users.forEach(user => {
        const userRoles = user.roles.map(ur => ur.role.name).join(", ");
        console.log(`- ${user.email}: [${userRoles}]`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
