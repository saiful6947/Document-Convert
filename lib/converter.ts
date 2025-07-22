// lib/converter.ts

interface OcrResult {
  extractedText: string
  detectedLanguage: string
}

/**
 * Simulates document conversion from PDF to target format.
 * In a real application, this would use libraries like 'mammoth.js' for DOCX,
 * or 'exceljs' for XLSX, or commercial APIs that handle complex PDF parsing
 * and reconstruction into editable formats while preserving layout, images, and colors.
 */
export async function simulateConversion(pdfBuffer: Buffer, format: string, ocrResult: OcrResult): Promise<Buffer> {
  console.log(`Simulating conversion to ${format} for PDF (size: ${pdfBuffer.length} bytes)`)
  console.log("OCR Result:", ocrResult.extractedText.substring(0, 100) + "...")

  await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1500)) // Simulate processing time

  let simulatedContent = ""
  if (format === "docx" || format === "doc") {
    simulatedContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Converted Document</title></head>
      <body>
        <div style='font-family: Arial, sans-serif; color: #333;'>
          <h1>Converted Document from PDF</h1>
          <p>This document was converted from your PDF file. The OCR process extracted the following text:</p>
          <div style='border: 1px solid #ccc; padding: 15px; margin-top: 20px; background-color: #f9f9f9;'>
            <p style='font-family: "Times New Roman", serif; line-height: 1.6;'>${ocrResult.extractedText.replace(/\n/g, "<br>")}</p>
          </div>
          <p style='margin-top: 20px;'>
            The original layout, including columns and embedded images, would be preserved here.
            Colors from the source PDF are also maintained.
          </p>
          <p style='color: #007bff;'>This is a sample of blue text.</p>
          <p style='color: #28a745;'>This is a sample of green text.</p>
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMGY3ZmEiLz4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyNSIgZmlsbD0iIzM0OThkYiIvPgogIDxyZWN0IHg9IjEyNSIgeT0iMjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzI3YWU2MCIvPgo8L3N2Zz4=" alt="Sample Graphic" style="width: 150px; height: 75px; margin-top: 20px;">
        </div>
      </body>
      </html>
    `
    // For actual DOCX, you'd use a library that converts this HTML to DOCX or directly manipulates DOCX structure.
    // For simplicity, we'll return a buffer of this HTML content.
    return Buffer.from(simulatedContent, "utf-8")
  } else if (format === "xlsx") {
    simulatedContent = `
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left;">Item</th>
            <th style="padding: 8px; text-align: left;">Quantity</th>
            <th style="padding: 8px; text-align: left;">Price</th>
            <th style="padding: 8px; text-align: left;">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px;">Product A</td>
            <td style="padding: 8px;">10</td>
            <td style="padding: 8px;">$25.00</td>
            <td style="padding: 8px;">${ocrResult.extractedText.split("\n")[0] || "Extracted English text"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;">Product B</td>
            <td style="padding: 8px;">5</td>
            <td style="padding: 8px;">$150.00</td>
            <td style="padding: 8px; font-family: 'SolaimanLipi', 'Kalpurush', 'Nikosh', Arial, sans-serif;">${ocrResult.extractedText.split("\n")[ocrResult.extractedText.split("\n").length - 1] || "নিষ্কাশিত বাংলা টেক্সট"}</td>
          </tr>
        </tbody>
      </table>
    `
    // For actual XLSX, you'd use a library like 'exceljs' to create a real Excel file.
    // For simplicity, we'll return a buffer of this HTML table content.
    return Buffer.from(simulatedContent, "utf-8")
  }

  return Buffer.from("Unsupported format", "utf-8")
}
