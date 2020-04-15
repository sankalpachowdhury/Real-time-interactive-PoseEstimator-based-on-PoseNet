
let brain;

function setup() {
  createCanvas(640, 480);
  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  // LOAD TRAINING DATA
  brain.loadData('ymca.json', dataReady); // load the existing data, then when the data is ready...
}

function dataReady() { // step 7: when the data is ready,
  brain.normalizeData(); // x, y values are on the p5 canvas which is 640 * 400
  // this needs to be normalized down to 0 & 1
  // we call the ml5 normalize function to take care of the normalization of the data
  brain.train({epochs: 50}, finished);  // call the train function
}                                       // running through the data 50 times

function finished() { // step 8: when training finished --> console log that the model is trained
  console.log('model trained');
  brain.save();  // save the model
}
