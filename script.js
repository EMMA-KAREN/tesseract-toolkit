const input = document.getElementById('imageInput');
const output = document.getElementById('output');

// 🔹 Helper: Resize + preprocess image before sending to Tesseract
function resizeAndPreprocessImage(file, maxWidth = 1000, maxHeight = 1000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target.result;
    };

    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      // maintain aspect ratio
      if (width > maxWidth) {
        height = Math.round((maxWidth / width) * height);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((maxHeight / height) * width);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // 🔹 Convert to grayscale + threshold (black/white)
      let imageData = ctx.getImageData(0, 0, width, height);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let threshold = avg > 150 ? 255 : 0; // simple threshold
        data[i] = data[i + 1] = data[i + 2] = threshold; // set R, G, B
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob(blob => {
        resolve(blob);
      }, file.type || "image/png");
    };

    img.onerror = err => reject(err);

    reader.readAsDataURL(file);
  });
}

// 🔹 Cleanup OCR text (remove noise + fix common mistakes)
function cleanupText(text) {
  let cleaned = text
    .replace(/[^a-zA-Z0-9\s.,!?]/g, '') // remove weird chars
    .replace(/\s+/g, ' ')               // normalize spaces
    .trim();

  // Fix common OCR mistakes
  cleaned = cleaned.replace(/Recaipt/g, 'Receipt')
                   .replace(/Templte/g, 'Template')
                   .replace(/Wor/g, 'Word')
                   .replace(/Esce/g, 'Excel')
                   .replace(/DF/g, 'PDF');

  return cleaned;
}

input.addEventListener('change', async () => {
  const file = input.files[0];
  if (file) {
    output.innerHTML = "⏳ Processing...";

    try {
      // 🔹 Resize + preprocess image before OCR
      const processedFile = await resizeAndPreprocessImage(file);

      Tesseract.recognize(
        processedFile,
        'eng', // OCR language
        {
          logger: info => console.log(info), // progress in console
          tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!? '
        }
      ).then(({ data: { text } }) => {
        let cleanedText = cleanupText(text);
        output.innerText = cleanedText || "⚠️ No clear text found.";
      }).catch(err => {
        console.error(err);
        output.innerText = "❌ Error processing image.";
      });
    } catch (err) {
      console.error("Image preprocessing failed:", err);
      output.innerText = "❌ Failed to process image.";
    }
  }
});
