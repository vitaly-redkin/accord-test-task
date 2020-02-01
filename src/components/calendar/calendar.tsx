import React from 'react'
import styled from 'styled-components'
import { classNames } from '../../lib/classnames'
import { randomClassName } from '../../lib/rcn'
import { FontWeights, Colors } from '../../lib/style-guide'
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
  isToday,
  truncateDate,
  areTheSameDates,
  decomposeMonth
} from '../../lib/date-utils'
import { range } from '../../lib/common-utils'
import { Arrow } from '../shared/arrow'

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
  belongsToOtherMonth: boolean
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
  const date: Date = truncateDate(value ?? new Date())
  const month: Month = getMonthFromDate(date)
  const now: Date = new Date()
  const today: Date = truncateDate(now)

  const [currentMonth, setCurrentMonth] = React.useState<Month>(month)

  // Calculate all month day properties we need and memoize them
  const monthDays: MonthDayProps[] = React.useMemo((): MonthDayProps[] => {
    const isCurrentMonth: boolean = getMonthFromDate(today) === currentMonth
    const md: MonthDays = getMonthDays(currentMonth)
    const { m } = decomposeMonth(currentMonth)

    return md.map(
      (d: Date): MonthDayProps => ({
        date: d,
        day: d.getDate(),
        isToday: isCurrentMonth && isToday(d),
        belongsToOtherMonth: d.getMonth() + 1 !== m,
        isSelectable: isDateValidToSelect(d)
      })
    )
  }, [currentMonth, today])

  // Set the current month by updated componet value property
  React.useEffect(() => {
    setCurrentMonth(month)
  }, [month])

  /**
   * Shift the current month back and forth.
   */
  const doShiftMonth = React.useCallback((shift: MonthShift): void => {
    setCurrentMonth((month) => shiftMonth(month, shift))
  }, [])

  /**
   * Goes to the previous month.
   */
  const goBack = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      e.stopPropagation()
      doShiftMonth(-1)
    },
    [doShiftMonth]
  )

  /**
   * Goes to the next month.
   */
  const goForth = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      e.stopPropagation()
      doShiftMonth(1)
    },
    [doShiftMonth]
  )

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
        <div className={classNames(rcn('prev-icon'))}>
          {currentMonth > MIN_MONTH && (
            <a href="#" onClick={goBack}>
              <Arrow />
            </a>
          )}
        </div>
        <div className={classNames(rcn('month-name-div'))}>
          {getMonthName(currentMonth)}
        </div>
        <div className={classNames(rcn('next-icon'))}>
          <a href="#" onClick={goForth}>
            <Arrow />
          </a>
        </div>
      </div>
    )
  }

  /**
   * Renders day header row.
   */
  const renderDayHeaders = (): JSX.Element => {
    return (
      <div className={classNames(rcn('day-header-div'))}>
        <div className={classNames(rcn('week-div'))}>
          {weekDayNames.map((weekDayName, index) => (
            <div key={index} className={classNames(rcn('week-day-div'))}>
              <span>{weekDayName}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * Render calendar date.
   */
  const renderDates = (): JSX.Element => {
    return (
      <div className={classNames(rcn('weeks-block-div'))}>
        {range(monthDays.length / 7).map((weekNo) => (
          <div key={weekNo} className={classNames(rcn('week-div'))}>
            {range(7).map((weekDay) => {
              const md: MonthDayProps = monthDays[weekNo * 7 + weekDay]
              const isSelected = !!value && areTheSameDates(md.date, value)
              const divClasses: string = [
                'date-div',
                ...(md.belongsToOtherMonth ? ['other-month-date-div'] : []),
                ...(isSelected ? ['selected-date-div'] : [])
              ]
                .map((name) => rcn(name))
                .join(' ')

              return (
                <div key={weekDay} className={classNames(divClasses)}>
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
                  {md.isToday && !isSelected && (
                    <div className={classNames(rcn('today-marker-div'))} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
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
  position: relative;
  width: 320px;
  height: 360px;
  background: #ffffff;
  text-align: center;
  line-height: 14px;
  border: 1px solid ${Colors.Border};
  box-sizing: border-box;
  box-shadow: 0px 4px 8px rgba(50, 73, 100, 0.1);

  .${rcn('month-div')} {
    border-bottom: 1px solid ${Colors.Border};
  }

  .${rcn('prev-icon')}, .${rcn('next-icon')} {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .${rcn('prev-icon')} a,
  .${rcn('next-icon')} a {
    padding: 20px;
  }

  .${rcn('next-icon')} {
    transform: rotate(180deg);
  }

  .${rcn('month-name-div')} {
    width: calc(100% - 40px);
    height: 50px;
    color: ${Colors.TX1};
    font-size: 16px;
    font-weight: ${FontWeights.SHM};
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .${rcn('day-header-div')}, .${rcn('weeks-block-div')} {
    padding: 0 20px 0 20px;
  }

  .${rcn('day-header-div')} {
    color: ${Colors.TX3};
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .${rcn('weeks-block-div')} {
    align-self: center;
  }

  .${rcn('month-div')}, .${rcn('week-div')} {
    display: flex;
    flex-direction: row;
  }

  .${rcn('week-day-div')} {
    width: 40px;
    height: 50px;
    flex-direction: column;
  }

  .${rcn('week-day-div')} span {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .${rcn('date-div')} {
    font-weight: ${FontWeights.SHM};
    text-decoration: none;
    color: ${Colors.TX1};
    position: relative;
  }

  .${rcn('date-div')} a {
    font-weight: ${FontWeights.SHM};
    text-decoration: none;
    color: ${Colors.TX1};
    display: flex;
    width: 40px;
    height: 40px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .${rcn('date-div')} > a:hover {
    background-color: ${Colors.BG2};
  }

  .${rcn('other-month-date-div')} a {
    color: ${Colors.TX3};
  }

  .${rcn('selected-date-div')}, .${rcn('selected-date-div')} > a:hover {
    background-color: ${Colors.AccordBlue};
  }

  .${rcn('selected-date-div')} a,
  .${rcn('selected-date-div')} > a:hover {
    color: white;
  }

  .${rcn('today-date-div')} {
    color: red;
  }

  .${rcn('today-marker-div')} {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: ${Colors.AccordBlue};
    position: absolute;
    left: 18px;
    bottom: 4px;
  }
`

export { StyledCalendar as Calendar }
