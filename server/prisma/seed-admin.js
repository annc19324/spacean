const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin account
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN',
            isApproved: true,
            status: 'ACTIVE',
            bio: 'System Administrator'
        }
    });

    console.log('✅ Admin created:', admin.username);
    console.log('📧 Username: admin');
    console.log('🔑 Password: Admin@123456');
    console.log('⚠️  PLEASE CHANGE PASSWORD AFTER FIRST LOGIN!');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
