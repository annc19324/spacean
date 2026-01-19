require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

async function main() {
    const password = await bcrypt.hash('SpaceAn2026!', 10);

    // Create user An
    const user = await prisma.user.upsert({
        where: { username: 'annc19324' },
        update: {},
        create: {
            username: 'annc19324',
            password: password,
            role: 'USER',
            isApproved: true,
            bio: 'Xin chào, tôi là An. Đây là không gian lưu trữ của tôi!',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An'
        },
    });

    console.log('User An created:', user.username);

    // Create some apps for An
    const app1 = await prisma.app.create({
        data: {
            name: 'MiniAn',
            description: 'Ứng dụng quản lý tài chính cá nhân siêu nhỏ gọn.',
            type: 'APP',
            downloadUrl: 'https://example.com/download/minian.zip',
            imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80',
            userId: user.id,
            views: 150,
            likes: 10,
            downloads: 40
        }
    });

    const app2 = await prisma.app.create({
        data: {
            name: 'SpaceAn Web',
            description: 'Phiên bản web của không gian lưu trữ SpaceAn.',
            type: 'WEB',
            link: 'https://spacean.example.com',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80',
            userId: user.id,
            views: 200,
            likes: 25
        }
    });

    console.log('Apps created for An.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
