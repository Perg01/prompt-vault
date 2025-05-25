// // test-connection.js
// import { PrismaClient } from './src/generated/prisma/index.js';

// const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
// });

// async function main() {
//     console.log('Attempting to connect to database...');

//     try {
//         // Simple query to test connection
//         const result = await prisma.$queryRaw`SELECT 1 as test`;
//         console.log('Connection successful!', result);
//     } catch (error) {
//         console.error('Connection failed:', error);
//     } finally {
//         await prisma.$disconnect();
//     }
// }

// main();