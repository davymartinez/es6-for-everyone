/* eslint-disable indent */
/* eslint-disable no-unused-vars */

// 🔥 This can also be done in a single .reduce(), but we're practicing arrow functions here, so chain them!

// Select all the list items on the page and convert to array
const listItemsArr = Array.from(document.querySelectorAll('[data-time]'));

// Filter for only the elements that contain the word 'Flexbox'
const filteredListArr = listItemsArr.
  filter(item => item.textContent.includes('Flexbox'));

// map down to a list of time strings
const timeStringsArr = filteredListArr.
  map(item => item.getAttribute('data-time'));
  // Wes' approach: item => item.dataset.time

// map to an array of seconds
const secondsArr = timeStringsArr
  .map(time => time.split(':'))
  .map(time => (time[0]*60 + time[1]*1));
    // Wes' approach:
    // .map(timecode => {
    //   const parts = timecode.split(':').map(part => parseFloat(part));
    //   return (parts[0] * 60) + parts[1];
    // })

// reduce to get total
const total = secondsArr.reduce((acc, secs) => acc + secs, 0);
console.log(total);