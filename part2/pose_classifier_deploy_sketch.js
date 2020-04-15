
let video;
let poseNet;
let pose;
let skeleton;

let brain;
let poseLabel = "Y";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  
  // LOAD PRETRAINED MODEL
  
  const modelInfo = {    // step 9: create an object to store the files/ file_names
    model: 'model2/model.json',  
    metadata: 'model2/model_meta.json', // copied from the ml5 neural network documentation
    weights: 'model2/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);  //step 8: load the model
  // there are three files for the model "model.jeson", "model_meta.jeson", "model.weights.bin"

}
// *** remember we are using two machine learning models, 
// one is poseNet
// other is Neural network brain classifier
function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function brainLoaded() {  // step 9: model ready after calling deep learning model here
  console.log('poseNet ready');
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
