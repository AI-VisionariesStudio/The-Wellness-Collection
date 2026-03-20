import { prisma } from '@/lib/prisma'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { sendCertificateEmail } from '@/lib/email'

export async function issueCertificate(userId: string, courseId: string) {
  const existing = await prisma.certificate.findFirst({ where: { userId, courseId } })
  if (existing) return { certificate: existing }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!user || !course) return { error: 'User or course not found' }

  const serialNumber = `CPA-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`
  const issuedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const certHtml = buildCertificateHTML({ user: user!, course, serialNumber, issuedDate })

  const certDir = path.join(process.cwd(), 'public/uploads/certificates')
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true })

  const pdfPath = `/uploads/certificates/${serialNumber}.pdf`
  const fullPath = path.join(process.cwd(), 'public', pdfPath)

  try {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const pg = await browser.newPage()
    await pg.setContent(certHtml, { waitUntil: 'networkidle0' })
    await pg.pdf({ path: fullPath, width: '11in', height: '8.5in', printBackground: true })
    await browser.close()
  } catch {
    fs.writeFileSync(fullPath.replace('.pdf', '.html'), certHtml)
  }

  const certificate = await prisma.certificate.create({
    data: { userId, courseId, serialNumber, pdfPath },
  })

  // Email the certificate (non-blocking)
  sendCertificateEmail(user!.email, user!.name, course.title, serialNumber, pdfPath).catch(err =>
    console.error('Certificate email failed:', err)
  )

  return { certificate }
}

export function buildCertificateHTML({ user, course, serialNumber, issuedDate }: {
  user: { name: string }
  course: { title: string; duration: number }
  serialNumber: string
  issuedDate: string
}) {
  const platformName = process.env.NEXT_PUBLIC_PLATFORM_NAME || 'Gracefully Redefined'
  const verifyUrl = process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/verify` : 'yourplatform.com/verify'

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 11in; height: 8.5in;
    font-family: 'Georgia', serif;
    background: #fdfaf6;
    display: flex; align-items: center; justify-content: center;
  }
  .cert {
    width: 9.5in; height: 7in;
    border: 3px solid #D1C8BF;
    outline: 8px solid #D1C8BF;
    outline-offset: 10px;
    padding: 60px 80px;
    text-align: center;
    position: relative;
    background: white;
  }
  .header { color: #7a7065; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px; }
  h1 { font-size: 52px; color: #1a1a1a; font-weight: normal; margin-bottom: 10px; letter-spacing: -1px; }
  .subtitle { font-size: 14px; color: #7a7065; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 40px; }
  .presented { font-size: 16px; color: #555; margin-bottom: 12px; }
  .name { font-size: 40px; color: #c8922a; border-bottom: 2px solid #c8922a; display: inline-block; padding-bottom: 8px; margin-bottom: 30px; }
  .course-text { font-size: 15px; color: #555; max-width: 500px; margin: 0 auto 30px; line-height: 1.6; }
  .course-name { font-weight: bold; color: #1a1a1a; }
  .hours { font-size: 18px; color: #1a1a1a; margin-bottom: 40px; }
  .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; }
  .sig-line { border-top: 1px solid #D1C8BF; width: 200px; padding-top: 8px; font-size: 12px; color: #555; }
  .serial { position: absolute; bottom: 20px; right: 30px; font-size: 10px; color: #aaa; letter-spacing: 1px; }
  .ornament { width: 80px; height: 80px; border: 2px solid #D1C8BF; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #c8922a; }
</style>
</head>
<body>
<div class="cert">
  <div class="header">${platformName} &nbsp;·&nbsp; The Wellness Collection</div>
  <h1>Certificate of Completion</h1>
  <div class="subtitle">Psychoeducational Achievement</div>
  <div class="presented">This certifies that</div>
  <div class="name">${user.name}</div>
  <div class="course-text">
    has successfully completed the<br>
    <span class="course-name">${course.title}</span>
  </div>
  <div class="hours">${course.duration} Hours of Learning &nbsp;|&nbsp; Issued ${issuedDate}</div>
  <div class="footer">
    <div class="sig-line">Authorized Signature</div>
    <div class="ornament">✦</div>
    <div class="sig-line">${issuedDate}</div>
  </div>
  <div class="serial">Serial: ${serialNumber} &nbsp;|&nbsp; Verify at ${verifyUrl}</div>
</div>
</body>
</html>`
}
