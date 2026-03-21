import os
import PyPDF2

pdf_path = r"c:\Users\s\Desktop\panit\GLS2026_Event_Brochure_A4_Superfinal.pdf"
output_file = r"c:\Users\s\Desktop\panit\brochure_content.txt"

try:
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        with open(output_file, "w", encoding="utf-8") as out:
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    out.write(f"--- Page {i+1} ---\n{text}\n")
    print(f"Successfully extracted content to {output_file}")
except Exception as e:
    print(f"Error reading PDF: {e}")
