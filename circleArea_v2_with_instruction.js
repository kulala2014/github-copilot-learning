/**
 * Calculates the area of a circle given its radius.
 * 
 * The function uses the formula: A = π * r²
 * where A is the area and r is the radius.
 * 
 * @param {number} radius - The radius of the circle (must be non-negative)
 * @returns {number} The calculated area of the circle
 * @throws {Error} If the radius is negative
 * 
 * @example
 * const area = calculateCircleArea(5);
 * console.log(area); // 78.53981633974483
 */
function calculateCircleArea(radius) {
  // Validate input: radius must be non-negative
  if (radius < 0) {
    throw new Error('Radius cannot be negative');
  }

  // Calculate area using the formula: A = π * r²
  return Math.PI * radius * radius;
}

// Usage examples
const smallCircle = calculateCircleArea(5);
console.log('Area of circle with radius 5:', smallCircle);
// Output: 78.53981633974483

const largeCircle = calculateCircleArea(10);
console.log('Area of circle with radius 10:', largeCircle);
// Output: 314.1592653589793

// Export for use in other modules
module.exports = calculateCircleArea;
