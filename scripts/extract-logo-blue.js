// This script extracts the dominant color from the logo image and prints it as a hex code.
import Jimp from 'jimp';

async function getDominantColor(imagePath) {
  const image = await Jimp.read(imagePath);
  const { r, g, b } = image.clone().resize(1, 1).bitmap.data;
  return rgbToHex(r, g, b);
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

(async () => {
  const hex = await getDominantColor('./public/images/bluesky_New_logo.jpg');
  console.log('Dominant color:', hex);
})();
