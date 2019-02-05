const outputs = [];
// const predictionPoint = 300;
const k = 10;    // k variable
const testSetSize = 100; //  10 random separate points

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
  // console.log(outputs);
}

function runAnalysis() {
  // For accuracy testing

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
  // Range of features from data array to check which produces much better accuracy
  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)]);  //  Get data for a feature 
    const [testSet, trainingSet] = splitData(minMax(data, 1), testSetSize);

    const accuracy = _.chain(testSet)
                        .filter(
                          testPoint => 
                            knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
                          )
                        .size()
                        .divide(testSetSize)
                        .value();
                        
    console.log("For feature of", k, ', accuracy is:', accuracy);
  });

}

// KNN algo implementation
function knn(data, point, k) {
  return _.chain(data)                
            .map(row => {
              return [
                  // Eg. to demo: row = [235, 0.53, 16, 2]
                distance(_.initial(row), point),    // initial(row) = [235, 0.53, 16]
                _.last(row) //  last(row) = 2
              ];
            }) // [ [ 290, 1 ], [ 100, 4 ], [ 50, 4 ], [ 300, 5 ] ]
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
  // Use Pythagorean theorem to get distance from the overall features
  return _.chain(pointA)  //  Use array for point A
            .zip(pointB)  //  Convert point A and point B arrays by taking their values in columns
            .map(pair => (pair[0] - pair[1]) ** 2)  //  Take every pair then use Pythagorean theorem (a^2 - b^2)
            .sum()
            .value() ** 0.5;  //  Transpose square from c to the sum
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

// Get normalized data
function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);

  // Iterate each column of data
  for(let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);

    const min = _.min(column);
    const max = _.max(column);
    
    // Iterate each row
    for(let j = 0; j < clonedData.length; j++) {
      // Formula for Normalization for value of feature
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }

  return clonedData;
}