import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const htmlPath = path.join(process.cwd(), 'public/wellness-cards-print.html')
  const html = fs.readFileSync(htmlPath, 'utf-8')

  try {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const pg = await browser.newPage()
    await pg.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await pg.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    await browser.close()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="21-affirmation-grounding-cards.pdf"',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    // Fallback: open the print HTML directly
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  }
}
