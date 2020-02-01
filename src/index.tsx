import React from 'react'
import ReactDOM from 'react-dom'
import { GlobalStyle } from './global-style'
import { CalendarTest } from './components/calendar-test/calendar-test'

console.info(`⚛️ ${React.version}`)

const App = () => (
  <>
    <GlobalStyle />
    <CalendarTest />
  </>
)

ReactDOM.render(<App />, document.getElementById('root'))

module.hot && module.hot.accept()
