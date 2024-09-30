let vanishingPointAngle = 0; // Initial angle of the vanishing point on the circle

function updateHorizon() {
  const horizon = document.getElementById('horizon');
  const horizonSlider = document.getElementById('horizon-slider');
  const newHeight = horizonSlider.value;

  // Update the horizon line position based on slider value (0-100 corresponds to percentage of screen height)
  horizon.style.top = `${newHeight}%`;

  // Update the horizon with the vanishing points
  updateMainViewHorizon();
}

function updateVanishingPoint() {
  const vanishingSlider = document.getElementById('vanishing-point-slider');
  vanishingPointAngle = vanishingSlider.value * 3.6; // Convert slider value (0-100) to angle (0-360 degrees)

  // Update the top-down preview and the main horizon
  updateTopDownPreview();
  updateMainViewHorizon();
}

function updateMainViewHorizon() {
    const horizonContainer = document.getElementById('horizon');
    const horizonWidth = horizonContainer.clientWidth;
    const visibleDegrees = 120; // Visible degrees on the main horizon
    const halfVisibleDegrees = visibleDegrees / 2;
  
    // First vanishing point (red, which should be forward/north-facing)
    const vanishingX1 = calculateVanishingPointOnHorizon(vanishingPointAngle, halfVisibleDegrees, horizonWidth);
    const vanishingPoint1 = document.getElementById('vanishing-point');
    
    // Second vanishing point (green, 90 degrees offset)
    const vanishingPointAngle2 = (vanishingPointAngle + 90) % 360;  // Offset by 90 degrees
    const vanishingX2 = calculateVanishingPointOnHorizon(vanishingPointAngle2, halfVisibleDegrees, horizonWidth);
    let vanishingPoint2 = document.getElementById('vanishing-point-2');
  
    // Ensure the second vanishing point (green) is created if not already
    if (!vanishingPoint2) {
      vanishingPoint2 = document.createElement('div');
      vanishingPoint2.id = 'vanishing-point-2';
      vanishingPoint2.classList.add('vanishing-point');
      vanishingPoint2.style.backgroundColor = 'green';  // Set the second point as green
      horizonContainer.appendChild(vanishingPoint2);
    }
  
    // Update the position of the first vanishing point (red), the north-facing one
    if (vanishingX1 !== null) {
      vanishingPoint1.style.left = `${vanishingX1}px`;
      vanishingPoint1.style.display = 'block';
      vanishingPoint1.style.backgroundColor = 'red'; // Ensure it's red
    } else {
      vanishingPoint1.style.display = 'none';
    }
  
    // Only show the second vanishing point (green, 90 degrees) if it's within the visible range
    if (vanishingX2 !== null) {
      vanishingPoint2.style.left = `${vanishingX2}px`;
      vanishingPoint2.style.display = 'block';
    } else {
      vanishingPoint2.style.display = 'none';
    }
  }
  
  // Function to calculate the vanishing point position on the horizon line
  function calculateVanishingPointOnHorizon(angle, halfVisibleDegrees, horizonWidth) {
    // Normalize angles greater than 180 (moving counterclockwise)
    let adjustedAngle = angle > 180 ? angle - 360 : angle;
  
    // Calculate the position of the vanishing point on the visible horizon if within range
    if (adjustedAngle >= -halfVisibleDegrees && adjustedAngle <= halfVisibleDegrees) {
      const percentagePosition = (adjustedAngle + halfVisibleDegrees) / (2 * halfVisibleDegrees);
      return horizonWidth * percentagePosition;  // Return position in pixels
    }
  
    // Return null if outside the visible range
    return null;
  }
  

// Calculate the vanishing point position on the horizon line
function calculateVanishingPointOnHorizon(angle, halfVisibleDegrees, horizonWidth) {
  // Normalize angles greater than 180 (moving counterclockwise)
  let adjustedAngle = angle > 180 ? angle - 360 : angle;

  // If within the visible 120-degree range, calculate its position on the horizon
  if (adjustedAngle >= -halfVisibleDegrees && adjustedAngle <= halfVisibleDegrees) {
    const percentagePosition = (adjustedAngle + halfVisibleDegrees) / (2 * halfVisibleDegrees);
    return horizonWidth * percentagePosition; // Return position in pixels
  }

  // If outside the visible range, return null (invisible)
  return null;
}

function updateTopDownPreview() {
  const canvas = document.getElementById('topdown-preview');
  const ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the circle (horizon)
  const radius = 60;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Draw the fixed blue point (center of the circle)
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw the first vanishing point on the rim of the circle
  const vanishingX1 = centerX + radius * Math.cos(vanishingPointAngle * (Math.PI / 180));
  const vanishingY1 = centerY + radius * Math.sin(vanishingPointAngle * (Math.PI / 180));
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(vanishingX1, vanishingY1, 5, 0, Math.PI * 2);
  ctx.fill();

  // Calculate and draw the second vanishing point, 90 degrees away from the first
  const vanishingPointAngle2 = (vanishingPointAngle + 90) % 360; // Offset by 90 degrees
  const vanishingX2 = centerX + radius * Math.cos(vanishingPointAngle2 * (Math.PI / 180));
  const vanishingY2 = centerY + radius * Math.sin(vanishingPointAngle2 * (Math.PI / 180));
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(vanishingX2, vanishingY2, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw lines from the center (blue point) to both vanishing points
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(vanishingX1, vanishingY1); // Line to the first vanishing point
  ctx.strokeStyle = 'red';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(vanishingX2, vanishingY2); // Line to the second vanishing point
  ctx.strokeStyle = 'green';
  ctx.stroke();
}

// Handle scroll event to rotate the vanishing points (angle on the circle)
window.addEventListener('wheel', (event) => {
  // Update the vanishing point angle with scroll input
  vanishingPointAngle += event.deltaY > 0 ? 1 : -1;

  // Normalize angle between 0 and 359
  if (vanishingPointAngle >= 360) {
    vanishingPointAngle = 0;
  } else if (vanishingPointAngle < 0) {
    vanishingPointAngle = 359;
  }

  // Update the preview canvas and horizon with the new rotation
  updateTopDownPreview();
  updateMainViewHorizon();
});

// Initial render of the top-down view and horizon
updateTopDownPreview();
updateMainViewHorizon();
