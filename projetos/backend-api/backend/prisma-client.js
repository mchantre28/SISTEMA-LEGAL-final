const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Função para desconectar o Prisma ao encerrar a aplicação
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});

module.exports = prisma;

