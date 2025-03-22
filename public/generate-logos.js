const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Logo configuration
const config = {
  primaryColor: '#0d6efd', // Bootstrap primary blue
  secondaryColor: '#0dcaf0', // Bootstrap info blue
  backgroundColor: '#ffffff',
  sizes: [16, 32, 48, 64, 128, 192, 256, 512],
  padding: 0.1, // 10% padding
};

// Function to create a single logo
function createLogo(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Calculate dimensions
  const padding = size * config.padding;
  const logoSize = size - (padding * 2);

  // Create gradient
  const gradient = ctx.createLinearGradient(
    padding,
    padding,
    size - padding,
    size - padding
  );
  gradient.addColorStop(0, config.primaryColor);
  gradient.addColorStop(1, config.secondaryColor);

  // Draw the logo
  ctx.save();
  ctx.translate(size / 2, size / 2);

  // Create a modern tech-inspired logo
  ctx.fillStyle = gradient;

  // Draw the main circular shape
  ctx.beginPath();
  ctx.arc(0, 0, logoSize * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Draw the outer ring
  ctx.beginPath();
  ctx.arc(0, 0, logoSize * 0.45, 0, Math.PI * 2);
  ctx.lineWidth = logoSize * 0.03;
  ctx.strokeStyle = gradient;
  ctx.stroke();

  // Draw the "T" shape
  const barWidth = logoSize * 0.15;
  const barHeight = logoSize * 0.6;
  
  // Vertical bar
  ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
  
  // Horizontal bar
  ctx.fillRect(-barHeight / 2, -barHeight / 2, barHeight, barWidth);

  // Add a subtle glow effect
  ctx.shadowColor = config.primaryColor;
  ctx.shadowBlur = logoSize * 0.1;
  ctx.beginPath();
  ctx.arc(0, 0, logoSize * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  return canvas;
}

// Function to create favicon.ico
async function createFavicon() {
  const sizes = [16, 32, 48];
  const images = sizes.map(size => {
    const canvas = createLogo(size);
    return {
      width: size,
      height: size,
      data: canvas.toBuffer('image/png')
    };
  });

  // Import icojs dynamically
  const IcoJS = await import('icojs');
  const icoData = await IcoJS.default.create(images);
  fs.writeFileSync(path.join(__dirname, 'favicon.ico'), icoData);
}

// Generate all logo sizes
async function generateLogos() {
  // Generate PNG logos
  config.sizes.forEach(size => {
    const canvas = createLogo(size);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(
      path.join(imagesDir, `logo${size}.png`),
      buffer
    );

    // Copy the 192 and 512 size logos to the public directory
    if (size === 192 || size === 512) {
      fs.copyFileSync(
        path.join(imagesDir, `logo${size}.png`),
        path.join(__dirname, `logo${size}.png`)
      );
    }
  });

  // Generate favicon.ico
  await createFavicon();

  console.log('Logo generation completed successfully!');
}

// Run the generation
generateLogos().catch(console.error); 