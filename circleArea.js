function calculateCircleArea(radius) {
  if (radius < 0) {
    throw new Error('Radius cannot be negative');
  }
  return Math.PI * radius * radius;
}

// Usage example
const area = calculateCircleArea(5);
console.log(area); // 78.53981633974483

// Export for use in other modules (if using Node.js/ES modules)
module.exports = calculateCircleArea;
