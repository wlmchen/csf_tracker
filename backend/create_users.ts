// npx ts-node script.ts

import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: "John",
            email: "test@gmail.com",
            
        }
    })
    const createMany = await prisma.user.createMany({
        data: [
          { name: 'Bob', email: 'bob@prisma.io' },
          { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
          { name: 'Yewande', email: 'yewande@prisma.io' },
          { name: 'Angelique', email: 'angelique@prisma.io' },
        ],
        skipDuplicates: true, // Skip 'Bobo'
      })

}

main()
    .then(async() => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })