import { prisma } from '../src/database'

async function main() {
    const onTopOfTheWorld = {
        name: "On Top of The World",
        youtubeLink: "https://www.youtube.com/watch?v=w5tWYmIOWGk",
        score: 120
    }

    const itsTime = {
        name: "It's Time",
        youtubeLink: "https://www.youtube.com/watch?v=sENM2wA_FTg",
        score: 50
    }

    const demons = {
        name: "Demons",
        youtubeLink: "https://www.youtube.com/watch?v=mWRsgZuwf_8",
        score: -30
    }

    await prisma.recommendation.upsert({ where: { name: "On Top of The World" }, update: { ...onTopOfTheWorld }, create: { ...onTopOfTheWorld } })
    await prisma.recommendation.upsert({ where: { name: "It's Time" }, update: { ...itsTime }, create: { ...itsTime } })
    await prisma.recommendation.upsert({ where: { name: "Demons" }, update: { ...demons }, create: { ...demons } })
}

main()
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
    .finally(() => {
        prisma.$disconnect()
    })