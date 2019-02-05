const outputs = [];
const predictionPoint = 300;
const k = 3;    // k variable
const testSetSize = 10; //  10 random separate points

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
  // console.log(outputs);
}

function runAnalysis() {
  // For accuracy testing
  const [testSet, trainingSet] = splitData(outputs, testSetSize);

  // let numberCorrect = 0;
  // for(let i=0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   // console.log("Bucket", bucket, testSet[i][3]);
  //   if(bucket === testSet[i][3]) {
  //     numberCorrect++;
  //   }
  // }

  // console.log('Accuracy: ', numberCorrect / testSetSize);

  // Simplified Lodash methods instead of commented code above
  const accuracy = _.chain(testSet)
                      .filter(testPoint => knn(trainingSet, testPoint[0]) === testPoint[3])
                      .size()
                      .divide(testSetSize)
                      .value();

  console.log('Accuracy: ', accuracy);
}

// KNN algo implementation
function knn(data, point) {
  return _.chain(data)                
            .map(row => [distance(row[0], point), row[3]]) // [ [ 290, 1 ], [ 100, 4 ], [ 50, 4 ], [ 300, 5 ] ]
            .sortBy(row => row[0])  //  [ [ 50, 4 ], [ 100, 4 ], [ 290, 1 ], [ 300, 5 ] ]
            .slice(0, k)    //  [ [ 50, 4 ], [ 100, 4 ], [ 290, 1 ] ]
            .countBy(row => row[1]) //  { '1': 1, '4': 2 }
            .toPairs(row => row[1]) //  [ [ '1', 1 ], [ '4', 2 ] ]
            .sortBy(row => row[1])  //  [ [ '1', 1 ], [ '4', 2 ] ]
            .last()     //  [ '4', 2 ]
            .first()    // '4'
            .parseInt() //  4 
            .value();
}

// Get distance from prediction point
function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

// Split data for test and training set
function splitData(data, testCount) {
  // Shuffle data to prevent bias
  const shuffled = _.shuffle(data);

  // Slice data for test set and training set
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}