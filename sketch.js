// ml5.js: Pose Estimation with PoseNet


let video;
let poseNet;
let pose;  // step 4: Make an assumption that this is to be used by only one person
let skeleton; // step 8 define a global variable for skeleton

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded); // step 1: reference to the ml5 poseNet lib
  poseNet.on('pose', gotPoses); // on pose is an event handler 
}

function gotPoses(poses) {
  //console.log(poses);   // step 3: printing the objects to the console and open the object description from the inspect console of the browser
  if (poses.length > 0) {  // step 5 Check if the length of the array
    pose = poses[0].pose   // property 1
    skeleton = poses[0].skeleton; // property 2
  }
}


function modelLoaded() {  // step 2:  call the posenet model
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {  // step 6 Make sure there is a valid pose first
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);  // step 8 Estimate distance from the eyes by looking at how far are the eyes
    fill(255, 0, 0);     // d is then assigned to there -v
    ellipse(pose.nose.x, pose.nose.y, d); // step 7 Draw the circle where you want to estimate pose
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32); // step 8 Add hand/ wrist keypoints
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {  // step 9 Loop through all the keypoints and draw a circle at each location
      let x = pose.keypoints[i].position.x; // pose = keypoint + position properties  
      let y = pose.keypoints[i].position.y; //this part can be confirmed by viewing the description of the objects
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {  // step 8  connection between different positions
      let a = skeleton[i][0]; // skeleton is a 2d array, in the second dimention it holds the two locations connected
      let b = skeleton[i][1];
      strokeWeight(2);  // thicker line
      stroke(255);  
      line(a.position.x, a.position.y,b.position.x,b.position.y); // Draw a line between two positions
    }
    
    
  
  
  
  }
}
