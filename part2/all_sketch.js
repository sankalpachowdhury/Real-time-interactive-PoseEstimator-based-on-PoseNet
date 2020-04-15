// All code: https://editor.p5js.org/codingtrain/sketches/JoZl-QRPK

// Separated into three sketches
// 1: Data Collection: https://editor.p5js.org/codingtrain/sketches/kTM0Gm-1q
// 2: Model Training: https://editor.p5js.org/codingtrain/sketches/-Ywq20rM9
// 3: Model Deployment: https://editor.p5js.org/codingtrain/sketches/c5sDNr8eM

let video;
let poseNet;
let pose;
let skeleton;

let brain;  // an object: brain 
let poseLabel = "";

let state = 'waiting';  // Keep track of the flow of the sketch
let targetLabel;  // define target label

function keyPressed() {  // Step 3: Function for interaction for recording the training data
  if (key == 't') {
    brain.normalizeData();
    brain.train({epochs: 50}, finished); 
  } else if (key == 's') {  // save data funtionality by key = s
    brain.saveData();  // save into a json file
  } else {
    targetLabel = key;  // target label = key pressed (key will be a target label)
    console.log(targetLabel);
    setTimeout(function() {  // Step 4: define a delay function for delay after key being pressed
      console.log('collecting');
      state = 'collecting';  // after delay, state is collecting
      setTimeout(function() {  // set time out again to stop collecting
        console.log('not collecting');  // stop collecting
        state = 'waiting'; // stop collecting and update the state
      }, 2000);     //// this is a state machine implementation 
    }, 1000);
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {  // Step 2: Define the properties of the network
    inputs: 34,    // Inputs
    outputs: 4,    // Outputs
    task: 'classification',  // classifier 
    debug: true
  }
  brain = ml5.neuralNetwork(options);  // Step 1: Assign brain to nuralnetwork object from ml5.js
  
  // LOAD PRETRAINED MODEL
  // Uncomment to train your own model!
  const modelInfo = {  // step 9: create an object to store the files/ file_names
    model: 'model2/model.json', // copied from the ml5 neural network documentation
    metadata: 'model2/model_meta.json',
    weights: 'model2/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded); //step 8: load the model
  // there are three files for the model "model.jeson", "model_meta.jeson", "model.weights.bin"

  // LOAD TRAINING DATA
  // brain.loadData('ymca.json', dataReady);  // load the existing data, then when the data is ready...
}
// *** remember we are using two machine learning models, 
// one is poseNet
// other is Neural network brain classifier
function brainLoaded() {  // step 9: model ready after calling deep learning model here
  console.log('pose classification ready!');
  classifyPose(); // step 10: when the brain is loaded we can ask it to classify
}

function classifyPose() { // step 10: inputs are defined here making afunction
  if (pose) {  // verify there is a pose at the first place
    let inputs = [];  
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);  
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);  //step 12: when the brain is loaded --> classify pose, if there is a pose--> call brain.classify
  } else {
    setTimeout(classifyPose, 100); // if no pose detected, wait for 100ms 
  }
}

function gotResult(error, results) {  //step 11: got results call back
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  classifyPose(); // step 12: when the brain is loaded --> classify pose, if there is a pose--> call brain.classify
}

function dataReady() {  // step 7: when the data is ready, 
  brain.normalizeData();  // x, y values are on the p5 canvas which is 640 * 400
  // this needs to be normalized down to 0 & 1
  // we call the ml5 normalize function to take care of the normalization of the data
  brain.train({  // call the train function
    epochs: 50  // running through the data 50 times
  }, finished);
}

function finished() {  // step 8: when training finished --> console log that the model is trained
  console.log('model trained');
  brain.save(); // save the model
  classifyPose();
}







function gotPoses(poses) {  //step 5: when state is collecting, 
  // console.log(poses); 
  if (poses.length > 0) {  
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') { // only when we recieve a data, I should only actually record data
      let inputs = [];  //step 6: define an array
      for (let i = 0; i < pose.keypoints.length; i++) {  // step 6: flatten the data, to a plane array
        let x = pose.keypoints[i].position.x;  // they are not in a plane array
        let y = pose.keypoints[i].position.y;  // they are not in a plane array
        inputs.push(x);  // push the coordinates in the inputs
        inputs.push(y);  // push the coordinates in the inputs
      }
      let target = [targetLabel];  // now take the target and put in an array
      brain.addData(inputs, target); //step 5: when we have a pose, we add data
    }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();

  fill(255, 0, 255);
  noStroke();
  textSize(512);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);
}
