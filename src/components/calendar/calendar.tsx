import React from 'react'
import styled from 'styled-components'
import { classNames } from '../../lib/classnames'
import { randomClassName } from '../../lib/rcn'
import {
  getMonthDays,
  MonthDays,
  getMonthFromDate,
  Month,
  shiftMonth,
  MonthShift,
  getMonthName,
  isDateValidToSelect,
  MIN_MONTH,
  isToday
} from '../../lib/date-utils'
import { range } from '../../lib/common-utils'

const rcn = randomClassName()

/**
 * Headers for the week days.
 */
const weekDayNames: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/**
 * Type for the calendar component properties.
 */
type CalendarProps = {
  /**
   * Calendar current date (undefined means nothing is selected yet).
   */
  value?: Date
  /**
   * Callback to call when a new date is selected in the calendar.
   * @param newValue selected value to set
   */
  onChange(newValue: Date): void
}

/**
 * Type for the month day properties.
 */
type MonthDayProps = {
  date: Date
  day: number
  isToday: boolean
  isSelectable: boolean
}

/**
 * Calendar component.
 * @param value Calendar current date (undefined means nothing is selected yet)
 * @param onChange Callback to call when a new date is selected in the calendar
 * @param className name of the class used by StyledComponents
 */
const Calendar: FC<CalendarProps> = ({
  value,
  onChange,
  className
}): JSX.Element => {
  const date: Date = value ?? new Date()
  const month: Month = getMonthFromDate(date)
  const now: Date = new Date()
  const today: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [currentMonth, setCurrentMonth] = React.useState<Month>(month)

  const monthDays: MonthDayProps[] = React.useMemo((): MonthDayProps[] => {
    const isCurrentMonth: boolean = getMonthFromDate(today) === currentMonth
    const md: MonthDays = getMonthDays(currentMonth)

    return md.map(
      (date: Date): MonthDayProps => ({
        date: date,
        day: date.getDate(),
        isToday: isCurrentMonth && isToday(date),
        isSelectable: isDateValidToSelect(date)
      })
    )
  }, [currentMonth, today])

  /**
   * Shift the current month back and forth.
   */
  const doShiftMonth = React.useCallback((shift: MonthShift): void => {
    setCurrentMonth((month) => shiftMonth(month, shift))
  }, [])

  /**
   * Goes to the previous month.
   */
  const goBack = React.useCallback(() => doShiftMonth(-1), [doShiftMonth])

  /**
   * Goes to the next month.
   */
  const goForth = React.useCallback(() => doShiftMonth(1), [doShiftMonth])

  /**
   * Selects the given date preventing the event default actions and propagation.
   * @param e event to handle
   * @param date datet to select
   */
  const selectDate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    date: Date
  ): void => {
    e.preventDefault()
    e.stopPropagation()
    onChange(date)
  }

  /**
   * Renders month header.
   */
  const renderMonthHeader = (): JSX.Element => {
    return (
      <div className={classNames(rcn('month-div'))}>
        <div className={classNames(rcn('prev-next-icon'))}>
          {currentMonth > MIN_MONTH && <button onClick={goBack}>&lt;</button>}
        </div>
        <div className={classNames(rcn('month-name-div'))}>
          {getMonthName(currentMonth)}
        </div>
        <div className={classNames(rcn('prev-next-icon'))}>
          <button onClick={goForth}>&gt;</button>
        </div>
      </div>
    )
  }

  /**
   * Renders day header row.
   */
  const renderDayHeaders = (): JSX.Element => {
    return (
      <div className={classNames(rcn('week-div'))}>
        {weekDayNames.map((weekDayName, index) => (
          <div key={index} className={classNames(rcn('week-day-div'))}>
            {weekDayName}
          </div>
        ))}
      </div>
    )
  }

  /**
   * Render calendar date.
   */
  const renderDates = (): JSX.Element => {
    return (
      <>
        {range(monthDays.length / 7).map((weekNo) => (
          <div key={weekNo} className={classNames(rcn('week-div'))}>
            {range(7).map((weekDay) => {
              const md: MonthDayProps = monthDays[weekNo * 7 + weekDay]
              return (
                <div key={weekDay} className={classNames(rcn('date-div'))}>
                  <a
                    href="#"
                    onClick={
                      md.isSelectable
                        ? (e) => selectDate(e, md.date)
                        : undefined
                    }
                  >
                    {md.day}
                  </a>
                </div>
              )
            })}
          </div>
        ))}
      </>
    )
  }

  /**
   * Renders component.
   */
  const render = (): JSX.Element => {
    return (
      <div className={className}>
        {renderMonthHeader()}
        {renderDayHeaders()}
        {renderDates()}
      </div>
    )
  }

  return render()
}

const StyledCalendar = styled(Calendar)`
  .${rcn('month-div')} {
  }

  .${rcn('prev-next-icon')} {
    width: 20px;
  }

  .${rcn('month-name-div')} {
    width: calc(100% - 40px);
    text-align: center;
  }

  .${rcn('month-div')}, .${rcn('week-div')} {
    display: flex;
    flex-direction: row;
  }

  .${rcn('week-day-div')}, .${rcn('date-div')} {
    width: 40px;
    height: 40px;
    align-self: center;
  }
`
export { StyledCalendar as Calendar }
