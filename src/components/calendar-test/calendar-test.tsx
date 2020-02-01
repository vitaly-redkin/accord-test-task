import React from 'react'
import styled from 'styled-components'
import { classNames } from '../../lib/classnames'
import { randomClassName } from '../../lib/rcn'
import { Calendar } from '../calendar/calendar'

const rcn = randomClassName()

/**
 * Component to test the calendar component.
 */
const CalendarTest: FC<{}> = ({ className }): JSX.Element => {
  const initialDate: Date | undefined = undefined
  // const initialDate: Date | undefined = new Date(1753, 0, 5)
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
      <div className={className}>
        <div>
          <Calendar value={date} onChange={changeDate} />
          <div className={classNames(rcn('current-date-div'))}>
            Current date is{' '}
            <strong>{date ? date.toDateString() : 'not set'}</strong>
          </div>
        </div>
      </div>
    )
  }

  return render()
}

const StyledCalendarTest = styled(CalendarTest)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .${rcn('current-date-div')} {
    text-align: center;
  }
`

export { StyledCalendarTest as CalendarTest }
