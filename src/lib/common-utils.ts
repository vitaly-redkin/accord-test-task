/**
 * File to contain common utility functions.
 */

/**
 * Creates a numeric array with n elements and values from 0 to n-1.
 * @param n the number of array elements
 */
export function range(n: number): number[] {
  const result: number[] = []
  for (let i = 0; i < n; i++) {
    result.push(i)
  }

  return result
}
