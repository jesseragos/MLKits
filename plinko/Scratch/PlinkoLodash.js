/* 
    ALGORITHM: KNN
    This problem considers one independent variable
    w/c is drop position
*/

var _ = require("lodash");
const predictionPoint = 300;
const k = 3;    // k variable

const outputs = [
    [10, 0.5, 16, 1],
    [200, 0.5, 16, 4],
    [350, 0.5, 16, 4],
    [600, 0.5, 16, 5]
];

const arr = _.chain(outputs)                
                .map(row => [distance(row[0]), row[3]]) // [ [ 290, 1 ], [ 100, 4 ], [ 50, 4 ], [ 300, 5 ] ]
                .sortBy(row => row[0])  //  [ [ 50, 4 ], [ 100, 4 ], [ 290, 1 ], [ 300, 5 ] ]
                .slice(0, k)    //  [ [ 50, 4 ], [ 100, 4 ], [ 290, 1 ] ]
                .countBy(row => row[1]) //  { '1': 1, '4': 2 }
                .toPairs(row => row[1]) //  [ [ '1', 1 ], [ '4', 2 ] ]
                .sortBy(row => row[1])  //  [ [ '1', 1 ], [ '4', 2 ] ]
                .last()     //  [ '4', 2 ]
                .first()    // '4'
                .parseInt() //  4 
                .value();

console.log(arr);

function distance(point) {
    return Math.abs(point - predictionPoint);
}