import { MatDateFormats } from '@angular/material/core';

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'll', // Moment.js long date format
  },
  display: {
    dateInput: 'll', // Display format for input
    monthYearLabel: 'MMMM YYYY', // Month and year label
    dateA11yLabel: 'll', // Accessibility format for date
    monthYearA11yLabel: 'MMMM YYYY' // Accessibility format for month and year
  }
};
