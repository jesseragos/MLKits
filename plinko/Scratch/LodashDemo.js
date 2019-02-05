var _ = require("lodash");

const numbers = [
    [10, 5],
    [31, 2],
    [34, 3],
    [51, 5],
    [23, -3]
];

// first param is the array
// second is the function in w/c every item in the array is called that will determine what to be sorted
//const sorted = _.sortBy(numbers, row => return row[1]);

// Map to return array of the second index per array
//const mapped = _.map(sorted, row => row[1]);

// Much easier code 
const arr = _.chain(numbers)
            .sortBy(row => row[1])
            .map(row => row[1])
            .value();

console.log(arr);