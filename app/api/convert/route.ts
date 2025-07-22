import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { IncomingForm } from "formidable"
import { simulateOcr } from "@/lib/ocr"
import { simulateConversion } from "@/lib/converter"

// Disable body parsing for Next.js to allow formidable to handle it
export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming form data (including file)
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "tmp"), // Temporary directory for uploads
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
    })

    const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req.body as any, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    const pdfFile = files.pdfFile ? (Array.isArray(files.pdfFile) ? files.pdfFile[0] : files.pdfFile) : null
    const format = Array.isArray(fields.format) ? fields.format[0] : fields.format
    const englishOcr = (Array.isArray(fields.englishOcr) ? fields.englishOcr[0] : fields.englishOcr) === "true"
    const banglaOcr = (Array.isArray(fields.banglaOcr) ? fields.banglaOcr[0] : fields.banglaOcr) === "true"

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF file uploaded." }, { status: 400 })
    }
    if (!format) {
      return NextResponse.json({ error: "No output format selected." }, { status: 400 })
    }
    if (!englishOcr && !banglaOcr) {
      return NextResponse.json({ error: "At least one OCR language must be selected." }, { status: 400 })
    }

    // Read the uploaded PDF file
    const pdfBuffer = await fs.readFile(pdfFile.filepath)

    // --- Step 1: Perform OCR ---
    // In a real application, you would use a library like 'tesseract.js' or a cloud service
    // like Google Cloud Vision AI, AWS Textract, or Azure Cognitive Services here.
    // These services are highly optimized for accuracy, especially for multilingual text.
    const ocrResult = await simulateOcr(pdfBuffer, { english: englishOcr, bangla: banglaOcr })

    // --- Step 2: Convert Document ---
    // For actual conversion, you'd use specialized libraries or APIs.
    // For DOCX: 'mammoth.js' (from HTML/Markdown), or commercial APIs like Aspose.
    // For XLSX: 'exceljs' (for programmatic creation), or commercial APIs.
    // These tools handle layout, formatting, and color preservation.
    const convertedFileBuffer = await simulateConversion(pdfBuffer, format, ocrResult)

    // Clean up the temporary file
    await fs.unlink(pdfFile.filepath)

    // Prepare response
    const fileName = pdfFile.originalFilename?.replace(/\.pdf$/i, `.${format}`) || `converted.${format}`
    const mimeType = getMimeType(format)

    return new NextResponse(convertedFileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    })
  } catch (error: any) {
    console.error("Conversion error:", error)
    if (error.message.includes("maxFileSize")) {
      return NextResponse.json({ error: "File size exceeds 50MB limit." }, { status: 413 })
    }
    return NextResponse.json({ error: "Failed to convert document. Please try again." }, { status: 500 })
  }
}

function getMimeType(format: string): string {
  switch (format) {
    case "doc":
      return "application/msword"
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    default:
      return "application/octet-stream"
  }
}
