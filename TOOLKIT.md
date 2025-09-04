# 🧠 Moringa AI Capstone Project: Beginner’s Toolkit with GenAI  
**Title:** “Prompt-Powered Kickstart: Building a Beginner’s Toolkit for Tesseract.js OCR”  


## 1. Title & Objective  
**Technology Chosen:** Tesseract.js (JavaScript OCR library)  

**Why I chose it:**  
- OCR (Optical Character Recognition) is a powerful, practical tool.  
- Tesseract.js works directly in the browser (no backend required).  
- Great way to demonstrate AI-driven coding support with a visible, interactive output.  

**End Goal:**  
- Build a simple webpage where a user uploads an image → text is extracted using Tesseract.js → cleaned and displayed neatly.  

---

## 2. Quick Summary of the Technology  
**What is Tesseract.js?**  
Tesseract.js is a pure JavaScript OCR (Optical Character Recognition) library that can recognize text in images in the browser or in Node.js.  

**Where is it used?**  
- Scanning receipts, invoices, IDs.  
- Building search systems for scanned PDFs.  
- Accessibility tools (reading text aloud from images).  

**Real-world example:**  
Google Lens and similar apps use OCR techniques to extract text from photos in real time.  

---

## 3. System Requirements  
- **OS:** Works on Linux, Windows, Mac (tested on Ubuntu).  
- **Tools/Editors:** Any code editor (VS Code recommended).  
- **Browser:** Chrome, Brave, Firefox, Safari (supports ES6).  
- **Dependencies:**  
  - Option 1: Use **CDN** (no installation required).  
  - Option 2: Use **Node.js** with `npm install tesseract.js`.  

---

## 4. Installation & Setup Instructions  

### Option 1: Quick Setup via CDN  
#### `Create a project directory and your files.

Bash

   ***mkdir tesseract-toolkit && cd tesseract-toolkit
   ***touch index.html script.js

#### In index.html, link to the Tesseract.js CDN and your script.js file.

   **HTML

        <script src="https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js"></script>
       <script src="script.js"></script>

### Option 2: Setup with Node.js (Optional)
   *Initialize a new Node.js project.

    Bash

      ***npm init -y
    ***Install the Tesseract.js package.

    Bash

      *** npm install tesseract.js
 Then import the package in your JavaScript file:

### JavaScript

import Tesseract from 'tesseract.js';

## 5. Minimal Working Example
index.html
HTML

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tesseract.js OCR Demo</title>
</head>
<body>
  <h1>🖼️ OCR with Tesseract.js</h1>
  <input type="file" id="imageInput">
  <p><strong>Extracted Text:</strong></p>
  <div id="output"></div>

  <script src="https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js"></script>
  <script src="script.js"></script>
</body>
</html>

### script.js (with image resizing + cleanup)
   JavaScript

            const input = document.getElementById('imageInput');
            const output = document.getElementById('output');

            input.addEventListener('change', async () => {
            const file = input.files[0];
            if (file) {
                output.innerHTML = "⏳ Processing...";
                const resizedBlob = await resizeImage(file);

                Tesseract.recognize(resizedBlob, 'eng+fra', {
                logger: info => console.log(info)
                }).then(({ data: { text } }) => {
                const cleaned = text
                    .replace(/[^a-zA-Z0-9\s.,!?]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                output.innerText = cleaned || "⚠️ No readable text found.";
                });
            }
            });

   ***xpected Output:

Upload an image with text (e.g., a payment receipt).

Extracted text is displayed neatly under “Extracted Text.”

### I Prompt Journal
#### Prompt 1: "Show me how to set up a simple Tesseract.js project that reads text from an uploaded image."
AI Response Summary: Provided base index.html and script.js code with event listeners.
Evaluation: This was the crucial first step. The provided code worked on the first try, giving me a solid foundation.

#### Prompt 2: "How can I show OCR progress while Tesseract.js processes an image?"
AI Response Summary: Suggested using the { logger: info => console.log(info) } option in the recognize function.
Evaluation: This was very helpful. It allowed me to see the progress percentage in the browser console, which is great for debugging and understanding the process.

##### Prompt 3: "How to optimize Tesseract.js for large images?"
AI Response Summary: Suggested resizing images with the <canvas> element before passing them to Tesseract.js.
Evaluation: This was a major performance improvement. Running OCR on large images was slow, and this tip significantly sped up the process, making the toolkit more practical.

##### Prompt 4: "How to clean OCR results from weird symbols?"
AI Response Summary: Advised using regular expressions (regex) to remove unwanted characters and extra spaces.
Evaluation: This tip made the final output much more readable and professional, transforming raw OCR data into a clean text block.

## 7. Common Issues & Fixes
      Issue	                               How I fixed it
***1. OCR output full of weird characters----I used the AI's suggestion to add a regex cleanup function to the script, filtering out non-alphanumeric symbols.

***2. Very slow on big images--------I implemented the image resizing step before running the OCR to reduce the processing time.

***3. No text extracted	------I learned from testing that the OCR works best on clear, printed text. For my toolkit, I noted that blurry or handwritten text might not be recognized.

***4."Script not found" error----I ensured the <script> tag for tesseract.min.js was placed before the <script> tag for script.js in the HTML file.

## 8. References
Tesseract.js Docs: https://tesseract.projectnaptha.com/

Tesseract.js GitHub Repo: https://github.com/naptha/tesseract.js

Demo Playground: https://tesseract.projectnaptha.com/examples

YouTube Tutorial: Tesseract.js OCR in 5 minutes