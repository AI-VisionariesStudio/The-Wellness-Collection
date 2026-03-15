const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yourplatform.com' },
    update: {},
    create: {
      email: 'admin@yourplatform.com',
      name: 'Platform Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Create demo student
  const studentPassword = await bcrypt.hash('Student123!', 12)
  await prisma.user.upsert({
    where: { email: 'demo@student.com' },
    update: {},
    create: {
      email: 'demo@student.com',
      name: 'Demo Student',
      password: studentPassword,
      role: 'STUDENT',
      emailVerified: true,
      caseNumber: 'CASE-2024-001',
      courtCounty: 'Orange',
      courtState: 'California',
    },
  })
  console.log('✅ Demo student created: demo@student.com / Student123!')

  // Create foundational course
  const course = await prisma.course.upsert({
    where: { id: 'course-foundational' },
    update: {},
    create: {
      id: 'course-foundational',
      title: 'Foundational Co-Parenting Skills',
      description: 'Master the essential tools to reduce conflict, communicate effectively, and put your child first—no matter your situation.',
      duration: 4,
      price: 4700, // $47.00
      order: 1,
      modules: {
        create: [
          {
            title: 'Understanding Co-Parenting',
            description: 'Build the foundation for successful co-parenting',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Welcome & What to Expect',
                  description: 'An overview of the course and how to get the most out of it.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 600,
                  order: 1,
                  quiz: {
                    create: {
                      questions: {
                        create: [
                          {
                            text: 'What is the primary focus of co-parenting?',
                            options: ['Winning arguments with your ex', 'Your child\'s wellbeing and stability', 'Proving you are the better parent', 'Following court orders only'],
                            correct: 1,
                            order: 1,
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  title: 'The Impact of Conflict on Children',
                  description: 'Research-backed insights into how parental conflict affects child development.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 900,
                  order: 2,
                },
                {
                  title: 'Setting Your Co-Parenting Goals',
                  description: 'Define what success looks like for your family.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 720,
                  order: 3,
                }
              ]
            }
          },
          {
            title: 'Communication Strategies',
            description: 'Learn to communicate without conflict',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'The Business Model of Co-Parenting',
                  description: 'Treat co-parenting like a professional partnership.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 840,
                  order: 1,
                },
                {
                  title: 'Written Communication Best Practices',
                  description: 'Texts, emails, and apps — how to communicate clearly and protect yourself.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 780,
                  order: 2,
                  quiz: {
                    create: {
                      questions: {
                        create: [
                          {
                            text: 'When communicating with your co-parent, you should:',
                            options: ['Express every emotion you feel', 'Keep messages brief, clear, and child-focused', 'Avoid all communication', 'Copy your attorney on everything'],
                            correct: 1,
                            order: 1,
                          }
                        ]
                      }
                    }
                  }
                },
              ]
            }
          },
          {
            title: 'Legal & Financial Basics',
            description: 'What you need to know about the legal side of co-parenting',
            order: 3,
            lessons: {
              create: [
                {
                  title: 'Understanding Your Parenting Plan',
                  description: 'How to read, follow, and modify your custody agreement.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 960,
                  order: 1,
                },
                {
                  title: 'Child Support Fundamentals',
                  description: 'How child support is calculated and what it covers.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 720,
                  order: 2,
                },
                {
                  title: 'Course Completion & Next Steps',
                  description: 'Wrap up and receive your completion certificate.',
                  videoUrl: '/uploads/videos/placeholder.mp4',
                  duration: 480,
                  order: 3,
                }
              ]
            }
          }
        ]
      }
    }
  })
  console.log('✅ Course created:', course.title)
  console.log('\n🎉 Seed complete! Visit http://localhost:3000')
  console.log('   Admin: admin@yourplatform.com / Admin123!')
  console.log('   Student: demo@student.com / Student123!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
