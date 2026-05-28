/**
 * TASK-B: BPSPクイズシードデータ投入
 * quiz_seed.json から Course / Module(更新) / Quiz / QuizOption を冪等投入する
 * 使用方法: npx tsx prisma/seed/seed-bpsp-quiz.ts
 */
import { PrismaClient } from '@prisma/client'
import quizData from './quiz_seed.json'

const prisma = new PrismaClient()

async function main() {
  const { course: courseMeta } = quizData.meta

  // 1. Course upsert
  const course = await prisma.course.upsert({
    where: { slug: courseMeta.slug },
    update: { title: courseMeta.title, description: courseMeta.description, isPublished: true },
    create: {
      slug: courseMeta.slug,
      title: courseMeta.title,
      description: courseMeta.description,
      isPublished: true,
      order: 1,
    },
  })
  console.log(`Course: ${course.slug} (${course.id})`)

  let totalQuizzes = 0
  let totalOptions = 0

  for (const mod of quizData.modules) {
    // 2. Module: find by levelNumber (= mod.order), update slug + courseId
    const module = await prisma.module.upsert({
      where: { levelNumber: mod.order },
      update: { slug: mod.slug, courseId: course.id, isPublished: true },
      create: {
        slug: mod.slug,
        courseId: course.id,
        levelNumber: mod.order,
        title: mod.title,
        description: '',
        isPublished: true,
        sortOrder: mod.order,
      },
    })
    console.log(`  Module: ${mod.slug} (${module.id})`)

    for (let qi = 0; qi < mod.quizzes.length; qi++) {
      const q = mod.quizzes[qi]

      // 3. Quiz upsert by id
      await prisma.quiz.upsert({
        where: { id: q.id },
        update: {
          question: q.question,
          type: q.type,
          explanation: q.explanation ?? null,
          isPublished: true,
          sortOrder: qi + 1,
        },
        create: {
          id: q.id,
          moduleId: module.id,
          question: q.question,
          type: q.type,
          explanation: q.explanation ?? null,
          isPublished: true,
          sortOrder: qi + 1,
        },
      })

      // 4. QuizOption: replace all (delete + createMany for idempotency)
      await prisma.quizOption.deleteMany({ where: { quizId: q.id } })
      await prisma.quizOption.createMany({
        data: q.options.map((opt) => ({
          quizId: q.id,
          text: opt.text,
          isCorrect: opt.isCorrect,
          order: opt.order,
        })),
      })

      totalQuizzes++
      totalOptions += q.options.length
    }
  }

  console.log(`\nSeed complete:`)
  console.log(`  Course:      1`)
  console.log(`  Modules:     ${quizData.modules.length}`)
  console.log(`  Quizzes:     ${totalQuizzes}`)
  console.log(`  QuizOptions: ${totalOptions}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
