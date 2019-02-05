const outputs = [];
const predictionPoint = 300;
const k = 3;    // k variable

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
  // console.log(outputs);
}

function runAnalysis() {
  // Write code here to analyze stuff

  // KNN algo implementation
  const bucket =  _.chain(outputs)                
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

    console.log("Your point wlil probably fall into ", bucket);
}

function distance(point) {
  return Math.abs(point - predictionPoint);
}