const input = document.getElementById('imageInput');
const output = document.getElementById('output');

// 🔹 Helper: Resize image before sending to Tesseract
function resizeImage(file, maxWidth = 1000, maxHeight = 1000) {
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

      canvas.toBlob(blob => {
        resolve(blob);
      }, file.type || "image/png");
    };

    img.onerror = err => reject(err);

    reader.readAsDataURL(file);
  });
}

input.addEventListener('change', async () => {
  const file = input.files[0];
  if (file) {
    output.innerHTML = "⏳ Processing...";

    try {
      // 🔹 Resize image before OCR
      const resizedFile = await resizeImage(file);

      Tesseract.recognize(
        resizedFile,
        'eng+fra', // English + French OCR
        { logger: info => console.log(info) } // progress in console
      ).then(({ data: { text } }) => {
        // 🔹 Cleanup extracted text
        let cleanedText = text
          .replace(/[^a-zA-Z0-9\s.,!?]/g, '') // keep only readable chars
          .replace(/\s+/g, ' ')               // normalize spaces
          .trim();

        output.innerText = cleanedText || "⚠️ No clear text found.";
      }).catch(err => {
        console.error(err);
        output.innerText = "❌ Error processing image.";
      });
    } catch (err) {
      console.error("Image resize failed:", err);
      output.innerText = "❌ Failed to process image.";
    }
  }
});
