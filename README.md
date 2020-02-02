# 📦 React / TypeScript starter project

    $ yarn
    $ yarn dev

## Conventions

* All components go in `components/`
* All files should be named using `dash-case`
* Utility functions go in `lib/`

## VSCode

Install

* https://github.com/styled-components/vscode-styled-components

Add the following to your workspace settings `.vscode/settings.json`

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```
## Changes
* I have added `dev_win`, `clean_win` and `audit` scripts to the `package.json` file. 
The first two scripts are for my own convenience - I used a Windows laptop to work
on this project and your `dev`/`clean` scripts required bash or orher Unix/Linux shell.
The "dummy" `audit` script was required to do the commits.
* I replaced the ```<Spinner/>``` component with the ```<CalendarTest/>``` one in the index.tsx file to show the calendar component I have created.

## Additions
* `src/components/calendar/calendar.tsx` file contains a "main" Calendar
component I have created. 
* `src/components/shared/arrow.tsx` file contains a component which shows an SVG with an arrow (the SVG has been copied from Figma). The arrow points to the left - it is up to
the component "user" to rotate it with the CSS ```transform``` directive.
* `src/components/calendar-test/calendar-test.tsx` file contains a component which hosts the ```<Calendar/>``` one and provides some visual "feedback" when the date is selected.
* `src/lib/date-utils.ts` file contains date-related utility functions. Some of them are a bit
"overengineered" to support the functionality I could anticipate to be requested next (like
prev/next year jumps, calendar min/max bounds, etc.)
* `src/lib/common-utils.ts` file contains common utility functions (just one by now). The ```range()``` function it contains may be easily replaced by using the spread operator over the iterator but this requires adding a compiler switch and I decided not to meddle with the projejct-wide settings.

## Notes
* I have added JSDoc-style comments to all functions/types I created and also commented non-obvious places inside some functions. I was not clearly stated in the requirements but is is how I do in my own "production" code.
* React component functions I created usually (save for trivial cases) have a separate ```render()``` arrow functions so the last row in the componet functions is ```return render()```. I use this pattern in my own code since it helps to avoid conflicts between scope of varialbles declared in other component arrow functions and variables required to render the component itself (in my approach these later ones are also local in the ```render()``` function).
* I used 1/1/1753 as the minimal allowed date to select in the calendar. This is because there is not much business sense in selecting the dates which are out of the "modern" (Gregorian) calendar we use. While it is a good example of an "overengineering" I mentioned above any real-life calendar component should support the min/max dates - so my approach illustrates how I will handle it.
