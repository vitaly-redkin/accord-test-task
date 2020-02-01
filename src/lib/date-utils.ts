/**
 * File to contain date utility functions.
 */

/**
 * Type to "encapsulate" month values.
 * Should be the string in YYYYMM format.
 */
export type Month = string

/**
 * Type for the "days of the month" structure.
 * It should be array of CALENDAR_DAY_COUNT days.
 */
export type MonthDays = Date[]

/**
 * Type for the supported month shifts
 */
export type MonthShift = 1 | -1 | 12 | -12

/**
 * The number of weeks to show in the calendar.
 */
export const CALENDAR_WEEK_COUNT = 6

/**
 * The total number of days to show in the calendar.
 */
export const CALENDAR_DAY_COUNT = CALENDAR_WEEK_COUNT * 7

/**
 * Minimal date in Gregorian calendar.
 */
const MIN_YEAR = 1753

/**
 * Minimal month in Gregorian calendar.
 */
export const MIN_MONTH = composeMonth(MIN_YEAR, 1)

/**
 * truncates the time portion of the given date.
 * @param date date to truncate
 */
export function truncateDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Get the month (of the Month type) from the given date.
 * @param date date to het the month from
 */
export function getMonthFromDate(date: Date): Month {
  const y: number = date.getFullYear()
  const m: number = date.getMonth() + 1

  return composeMonth(y, m)
}

/**
 * Returns days of the current month (plus possibly days from previous
 * and the next moths to supplement to CALENDAR_WEEK_COUNT weeks).
 * @param month month to return the days of
 */
export function getMonthDays(month: Month): MonthDays {
  const { y, m } = decomposeMonth(month)
  const lastDay: Date = new Date(y, m, 0)
  const days: MonthDays = []
  for (let d = 1; d < lastDay.getDate(); d++) {
    days.push(new Date(y, m - 1, d))
  }

  const firstDay: Date = new Date(y, m - 1, 1)
  let firstDoW: number = firstDay.getDay()
  if (firstDoW === 0) {
    // Make Sunday 7th day instead of 0th one
    firstDoW = 7
  } else if (firstDoW === 1) {
    // Check for the special case when Monday is the first day of the month
    firstDoW = 8
  }
  // Add days from the previous month at the beginning
  for (let i = 1; i < firstDoW; i++) {
    const date: Date = new Date(days[0])
    date.setDate(date.getDate() - 1)
    days.unshift(date)
  }

  // Add days from the next month to supplement to the CALENDAR_DAY_COUNT
  const daysCount = days.length
  for (let i = 0; i < CALENDAR_DAY_COUNT - daysCount; i++) {
    const date: Date = new Date(days[days.length - 1])
    date.setDate(date.getDate() + 1)
    days.push(date)
  }

  return days
}

/**
 * Shift the given month back or forth by the specified number of months.
 * @param month month to shift
 * @param shift number of months (1, -1, 12, -12) to shift the given month by
 */
export function shiftMonth(month: Month, shift: MonthShift): Month {
  let { y, m } = decomposeMonth(month)
  if (Math.abs(shift) === 1) {
    m += shift
    if (m === 0 || m > 12) {
      m = m === 0 ? 12 : 1
      y += Math.sign(shift)
    }
  } else if (Math.abs(shift) === 12) {
    y += Math.sign(shift)
  }

  const result: Month = composeMonth(y, m)
  // If the result is out of the Gregorian calendar range return the unchanged month
  return result >= MIN_MONTH ? result : month
}

/**
 * Checks if the given date can be selected in the calendar.
 * The current implementation just ensures the date in the Gregorian calendar range.
 * @param date date to check
 */
export function isDateValidToSelect(date: Date): boolean {
  return getMonthFromDate(date) >= MIN_MONTH
}

/**
 * Returns the name of the month (in the "Month, Year" format)
 * @param month month to return the name of
 */
export function getMonthName(month: Month): string {
  const { y, m } = decomposeMonth(month)
  const monthName: string = new Date(y, m - 1, 1).toLocaleString('default', {
    month: 'long'
  })

  return `${monthName} ${y}`
}

/**
 * Returns true if the date parts of the given dates are equal.
 * @param date1 the first date to compare
 * @param date2 the second date to compare
 */
export function areTheSameDates(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Returns true if the given date is today.
 * @param date date to compare with today
 */
export function isToday(date: Date): boolean {
  return areTheSameDates(date, new Date())
}

/**
 * Decomposes the given month to year and month (January=1) numbers.
 * @param month month to decompose
 */
export function decomposeMonth(month: Month): { y: number; m: number } {
  return {
    y: parseInt(month.substr(0, 4)),
    m: parseInt(month.substr(4, 2))
  }
}

/**
 * Composes year and month number into the month string.
 * @param y year number
 * @param m month number (January=1)
 */
function composeMonth(y: number, m: number): Month {
  return y.toString().padStart(4, '0') + m.toString().padStart(2, '0')
}
