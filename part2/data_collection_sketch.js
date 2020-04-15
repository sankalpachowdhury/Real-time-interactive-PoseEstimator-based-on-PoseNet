// All code: 

// Separated into three sketches
// 1: Data Collection: 
// 2: Model Training: 
// 3: Model Deployment: 

let video;
let poseNet;
let pose;
let skeleton;

let brain;  // an object: brain 

let state = 'waiting';  // Keep track of the flow of the sketch
let targeLabel;         // define target label

function keyPressed() { // Step 3: Function for interaction for recording the training data

 if (key == 's') {      // save data funtionality by key = s
    brain.saveData();   // save into a json file
  } else {
    targetLabel = key;  // target label = key pressed (key will be a target label)
    console.log(targetLabel);
    setTimeout(function() { // Step 4: define a delay function for delay after key being pressed
      console.log('collecting');
      state = 'collecting'; // after delay, state is collecting
      setTimeout(function() { // set time out again to stop collecting
        console.log('not collecting'); // stop collecting
        state = 'waiting';  // stop collecting and update the state
      }, 10000);   //// this is a state machine implementation 
    }, 10000);
  }
}

function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {   // Step 2: Define the properties of the network
    inputs: 34,     // Inputs
    outputs: 4,     // Outputs
    task: 'classification',  // classifier 
    debug: true
  }
  brain = ml5.neuralNetwork(options); // Step 1: Assign brain to nuralnetwork object from ml5.js
}
  // LOAD TRAINING DATA
  // brain.loadData('ymca.json', dataReady);
function gotPoses(poses) { //step 5: when state is collecting, 
  // console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == 'collecting') { // only when we recieve a data, I should only actually record data
      let inputs = [];  //step 6: define an array
      for (let i = 0; i < pose.keypoints.length; i++) { // step 6: flatten the data, to a plane array
        let x = pose.keypoints[i].position.x;  // they are not in a plane array
        let y = pose.keypoints[i].position.y;  // they are not in a plane array
        inputs.push(x);  // now take the target and put in an array
        inputs.push(y);  //step 5: when we have a pose, we add data
      }
      let target = [targetLabel];
      brain.addData(inputs, target);
    }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
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
}
