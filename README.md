# Real-time-interactive-PoseEstimator-based-on-PoseNet

##***Part 1:*** 


Pose estimation using PoseNet pretrained model and calling it through ml5.js


1. We have used the PoseNet pretrained model for this project.

2. The posenet model is called through ml5.js

3. Online javascript web editor called P5.js is used as the web editor.

4. Pose Estimation is done in the steps.




*Image -----> PoseNet -----> Array of (x,y) coordinates -----> Confidence Score '%'*



**Steps for building a Realtime Pose Estimator in the browser is given below**

1. Call the 'ml5.min.js' dependencies from the index.html file.
2. Define the Window size and all backgrounds.
3. Define the css Style for the project in style.css file.
4. Follow along the steps in the sketch.js file.

    step 1: 
    Reference to ml5 PoseNet Library and include arguments : video and modelLoaded 
    This should be called steup() function
    
    step 2: 
    Calling the PoseNet model using the function modelLoaded()
    
    step 3:
    Printing the objects to the console by using console.log(poses) and the     open the object description from the inspect console of the browser.
    
    step 4:
    Making an assumption first, i.e. let pose, which means it is used by only one person.
    
    step 5:
    Check the length of the array : if(poses.length>0)
    If the array is non-empty then we come to the two property of the object description, which are poses and skeleton, and we need to store them.
    
    step 6:
    Argument if(pose) is used. This means if(pose)=TRUE, i.e. if there exist a valid pose. We first make sure that there is a valid pose.
    
    step 7:
    Draw the circle where you want to estimate pose.
    Ellipse function is used to draw the ellipse using the x and y coordinates and the distance (distance between the x and y coordinates of right eye and left eye).
    
    step 8:
    First calculation of distance d is done by measuring the distance between the x and y coordinates of right eye and left eye.
    Next add the wrist/ hand keypoints. by using the ellipse function. 
    Next we take an internal variable, whose scope is within the for loop, this act as a connection between different key points. 
    
    step 9:
    We take an internal and use for loop. This loop will go through all the kepoints and draw a circle at each location.
    
##***Part 2:***
    
**Authors:** Subhashree Dutta, Sankalpa Chowdhury, Dept. of Computer Science and Engineering, The University of Burdwan. 
