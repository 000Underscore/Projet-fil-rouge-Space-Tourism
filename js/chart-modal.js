// Modal functionality
const chartBtn = document.getElementById('chartBtn');
const chartModal = document.getElementById('chartModal');
const closeModal = document.getElementById('closeModal');
const controlBtns = document.querySelectorAll('.chart-control-btn');

let currentChartType = 'distance';

chartBtn.addEventListener('click', () => {
  chartModal.style.display = 'block';
  createChart(currentChartType);
});

closeModal.addEventListener('click', () => {
  chartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === chartModal) {
    chartModal.style.display = 'none';
  }
});

// Chart type controls
if (controlBtns.length > 0) {
  controlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      controlBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentChartType = btn.dataset.type;
      createChart(currentChartType);
    });
  });
}

// Chart creation
function createChart(chartType = 'distance') {
  const canvas = document.getElementById('comparisonChart');
  const ctx = canvas.getContext('2d');
  
  // Clear previous chart
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set canvas size to fill container
  const container = canvas.parentElement;
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  
  // Extract data from destinations
  const destinations = Object.keys(destinationsData);
  const distances = [];
  const travelTimes = [];
  
  destinations.forEach(dest => {
    // Convert distance to numeric value (in millions of km)
    const distanceStr = destinationsData[dest].distance;
    let distance = 0;
    if (distanceStr.includes('km')) {
      distance = parseFloat(distanceStr.replace(/[^0-9.]/g, '')) / 1000000;
    } else if (distanceStr.includes('mil. km')) {
      distance = parseFloat(distanceStr.replace(/[^0-9.]/g, ''));
    } else if (distanceStr.includes('bil. km')) {
      distance = parseFloat(distanceStr.replace(/[^0-9.]/g, '')) * 1000;
    }
    distances.push(distance);
    
    // Convert travel time to numeric value (in days)
    const travelTimeStr = destinationsData[dest].travelTime;
    let travelTime = 0;
    if (travelTimeStr.includes('days')) {
      travelTime = parseFloat(travelTimeStr.replace(/[^0-9.]/g, ''));
    } else if (travelTimeStr.includes('months')) {
      travelTime = parseFloat(travelTimeStr.replace(/[^0-9.]/g, '')) * 30;
    } else if (travelTimeStr.includes('years')) {
      travelTime = parseFloat(travelTimeStr.replace(/[^0-9.]/g, '')) * 365;
    }
    travelTimes.push(travelTime);
  });
  
  // Find max values for scaling
  const maxDistance = Math.max(...distances);
  const maxTravelTime = Math.max(...travelTimes);
  
  // Chart dimensions
  const padding = Math.min(80, canvas.width * 0.08);
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;
  const barWidth = chartWidth / (destinations.length * 3); // More space for each destination
  
  // Draw axes
  ctx.strokeStyle = '#d0d6f9';
  ctx.lineWidth = Math.max(2, canvas.width * 0.002);
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw bars and labels
  destinations.forEach((dest, index) => {
    const groupWidth = barWidth * 2.5; // More space between groups
    const x = padding + (index * groupWidth) + groupWidth/2;
    
    // Destination name
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.max(14, canvas.width * 0.015)}px Barlow Condensed`;
    ctx.textAlign = 'center';
    ctx.fillText(destinationsData[dest].name, x, canvas.height - padding + Math.max(20, canvas.height * 0.03));
    
    if (chartType === 'distance' || chartType === 'both') {
      // Distance bar (custom scale for better visual distinction)
      const minDistance = Math.min(...distances);
      const maxDistance = Math.max(...distances);
      // Use custom scale: power of 0.3 for more compression
      const powMin = Math.pow(minDistance, 0.3);
      const powMax = Math.pow(maxDistance, 0.3);
      const powCurrent = Math.pow(distances[index], 0.3);
      const normalizedDistance = 1 - ((powCurrent - powMin) / (powMax - powMin));
      const distanceHeight = normalizedDistance * chartHeight * 0.8; // Use 80% of chart height
      ctx.fillStyle = '#ff6b6b';
      const barX = chartType === 'both' ? x - barWidth : x - barWidth/2;
      const barW = chartType === 'both' ? barWidth * 0.8 : barWidth * 1.2;
      ctx.fillRect(barX, canvas.height - padding - distanceHeight, barW, distanceHeight);
      
      // Distance value (horizontal text)
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(12, canvas.width * 0.012)}px Barlow`;
      ctx.textAlign = 'center';
      ctx.fillText(destinationsData[dest].distance, barX + barW/2, canvas.height - padding - distanceHeight - 10);
    }
    
    if (chartType === 'time' || chartType === 'both') {
      // Travel time bar (custom scale for better visual distinction)
      const minTravelTime = Math.min(...travelTimes);
      const maxTravelTime = Math.max(...travelTimes);
      // Use custom scale: power of 0.5 (square root) for moderate compression
      const powMin = Math.pow(minTravelTime, 0.5);
      const powMax = Math.pow(maxTravelTime, 0.5);
      const powCurrent = Math.pow(travelTimes[index], 0.5);
      const normalizedTravelTime = (powCurrent - powMin) / (powMax - powMin);
      const travelTimeHeight = normalizedTravelTime * chartHeight * 0.8;
      ctx.fillStyle = '#4ecdc4';
      const barX = chartType === 'both' ? x : x - barWidth/2;
      const barW = chartType === 'both' ? barWidth * 0.8 : barWidth * 1.2;
      ctx.fillRect(barX, canvas.height - padding - travelTimeHeight, barW, travelTimeHeight);
      
      // Travel time value (horizontal text)
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(12, canvas.width * 0.012)}px Barlow`;
      ctx.textAlign = 'center';
      ctx.fillText(destinationsData[dest].travelTime, barX + barW/2, canvas.height - padding - travelTimeHeight - 10);
    }
  });
  
  // Legend
  const legendX = canvas.width - Math.max(250, canvas.width * 0.25);
  const legendY = Math.max(30, canvas.height * 0.04);
  const legendBoxSize = Math.max(20, canvas.width * 0.02);
  let legendOffset = 0;
  
  if (chartType === 'distance' || chartType === 'both') {
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(legendX, legendY + legendOffset, legendBoxSize, legendBoxSize);
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.max(14, canvas.width * 0.015)}px Barlow`;
    ctx.textAlign = 'left';
    ctx.fillText('Distance', legendX + legendBoxSize + 10, legendY + legendOffset + legendBoxSize - 5);
    legendOffset += legendBoxSize + 15;
  }
  
  if (chartType === 'time' || chartType === 'both') {
    ctx.fillStyle = '#4ecdc4';
    ctx.fillRect(legendX, legendY + legendOffset, legendBoxSize, legendBoxSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Travel time', legendX + legendBoxSize + 10, legendY + legendOffset + legendBoxSize - 5);
    legendOffset += legendBoxSize + 15;
  }
  
  // Add max values info
  ctx.font = `${Math.max(10, canvas.width * 0.01)}px Barlow`;
  ctx.fillStyle = '#d0d6f9';
  if (chartType === 'distance' || chartType === 'both') {
    ctx.fillText(`Max: ${maxDistance.toFixed(1)}M km`, legendX + legendBoxSize + 10, legendY + legendOffset + 15);
    legendOffset += 20;
  }
  if (chartType === 'time' || chartType === 'both') {
    ctx.fillText(`Max: ${maxTravelTime.toFixed(0)} days`, legendX + legendBoxSize + 10, legendY + legendOffset + 15);
  }
  
  // Y-axis labels (normalized scale 0-1)
  ctx.fillStyle = '#d0d6f9';
  ctx.font = `${Math.max(12, canvas.width * 0.012)}px Barlow`;
  ctx.textAlign = 'right';
  
  // Normalized scale
  for (let i = 0; i <= 5; i++) {
    const y = canvas.height - padding - (i * chartHeight / 5);
    const value = (i / 5).toFixed(1);
    ctx.fillText(value + 'x', padding - Math.max(10, canvas.width * 0.01), y + 5);
  }
  
  // Add scale explanation
  ctx.font = `${Math.max(10, canvas.width * 0.01)}px Barlow`;
  const scaleText = chartType === 'both' ? '(power scales - distance^0.3 inverted, time^0.5 normal)' : 
                   chartType === 'distance' ? '(power 0.3 - closer = higher)' : 
                   '(power 0.5 - longer = higher)';
  ctx.fillText(scaleText, padding - Math.max(10, canvas.width * 0.01), padding - 10);
}