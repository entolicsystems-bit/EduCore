// src/common/pdf/pdf.util.ts
import puppeteer from "puppeteer";

export async function htmlToPdf(html: string): Promise<Buffer> {
  console.log("htmlToPdf Working");

  const browser = await puppeteer.launch({
    headless: true, // important for newer puppeteer
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage", //critical for low-memory servers
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
    ],
  });

  try {
    console.log("Puppeteer browser launched");

    const page = await browser.newPage();

    // Prevent hanging in prod
    page.setDefaultTimeout(60_000);

    await page.setContent(html, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
    });

    console.log("HTML content set, generating PDF...");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "30mm",
        right: "20mm",
        bottom: "30mm",
        left: "20mm",
      },
    });

    console.log("PDF generated successfully");

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("❌ htmlToPdf failed:", error);
    throw error;
  } finally {
    await browser.close();
    console.log("Puppeteer browser closed");
  }
}
