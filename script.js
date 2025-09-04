// console.log('Tesseract.js working');
const input = document.getElementById('imageInput');
const output = document.getElementById('output');

input.addEventListener('change', () => {
  const file = input.files[0];
  if (file) {
    output.innerHTML = "⏳ Processing...";
    Tesseract.recognize(
      file,
      'eng',
      { logger: info => console.log(info) } // shows progress in console
    ).then(({ data: { text } }) => {
      output.innerText = text;
    });
  }
});
