// src/common/pdf/pdf.util.ts
import puppeteer from "puppeteer";

export async function htmlToPdf(html: string): Promise<Buffer> {
    console.log("htmlToPdf Working");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
    });

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "30mm",
        right: "20mm",
        bottom: "30mm",
        left: "20mm",
      },
    });

    return Buffer.from(pdfUint8Array);
  } finally {
    await browser.close();
  }
}
