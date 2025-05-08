from fastapi import FastAPI, UploadFile, File
import pdfplumber
import logging

# Suppress pdfminer warnings
logging.getLogger('pdfminer').setLevel(logging.ERROR)

app = FastAPI()

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        with pdfplumber.open(file.file) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return {"text": text.strip()}
    except Exception as e:
        return {"error": str(e)}


# uvicorn main:app --host 0.0.0.0 --port 8000
