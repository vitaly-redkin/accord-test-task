import React from 'react'
import { Calendar } from '../calendar/calendar'

/**
 * Component to test the calendar component.
 */
const CalendarTest = (): JSX.Element => {
  const initialDate: Date | undefined = undefined
  //const initialDate: Date | undefined = new Date(1753, 0, 5)
  const [date, setDate] = React.useState<Date | undefined>(initialDate)

  /**
   * Handles date change.
   */
  const changeDate = React.useCallback((newDate: Date): void => {
    setDate(newDate)
  }, [])

  /**
   * Renders the component.
   */
  const render = (): JSX.Element => {
    return (
      <div>
        <Calendar value={date} onChange={changeDate} />
        <hr />
        Current date is {date ? date.toDateString() : 'not set'}
      </div>
    )
  }

  return render()
}

export { CalendarTest }
