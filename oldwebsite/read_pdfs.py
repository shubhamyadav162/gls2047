import os
import PyPDF2

pdf_dir = r"c:\Users\s\Desktop\panit"
pdfs = [
    "EH1-G-FLOOR_GLS - 2026_Layout_10.03.2026.pdf",
    "Global Leadership Summit 2026.pdf",
    "Partnership Opportunities PAN IIT GLS2026.pdf"
]

output_file = os.path.join(pdf_dir, "parsed_pdfs.txt")

with open(output_file, "w", encoding="utf-8") as out:
    for pdf in pdfs:
        path = os.path.join(pdf_dir, pdf)
        out.write(f"\n\n--- Content of {pdf} ---\n\n")
        try:
            with open(path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for i, page in enumerate(reader.pages):
                    text = page.extract_text()
                    if text:
                        out.write(f"Page {i+1}:\n{text}\n")
        except Exception as e:
            out.write(f"Error reading PDF: {e}\n")

print("Finished parsing PDFs.")
