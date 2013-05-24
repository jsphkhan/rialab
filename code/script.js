var min = 1; //minimum number of image
var max = 7; //maximum number of images
var current = 4; //image number that is at the center of the coverflow
var currPos = 0; //custom attribute that stores current TranslateX position of each image
var newPos = 0; //custom attribute that stores new TranslateX position of each image, i.e after movement
var currAngle = 0; //custom attribute that stores current RotationY angle of each image
var newAngle = 0; //custom attribute that stores new RotationY angle of each image
var gap = 50;
var clickedIndex = 0; //index of the image tapped
var isMouseDown = false; //has the user interacted
var swipeStartX = 0;
var swipeDistanceX = 0;
var diff = 0;
var imageTapStartX = 0;
var imageTapEndX = 0;
var imageTapDistanceX= 0;
var coverFlowContainerElement = null;
var thresholdDistanceSingleSlide = 0; //this measures the distance

window.addEventListener("load",function(){
    /* Hide the browser address bar. This will give a native feel to the app */
    setTimeout(function() { window.scrollTo(0, 1); }, 20);

    /* Get the pointer to the coverflow holder */
    coverFlowContainerElement = document.getElementById("coverflow");
    moveImagesFromRight();  //help comments are there in the function definition
    addEventsToImageHolders(); //help comments are there in the function definition
    addEventToCoverflowHolder(); //help comments are there in the function definition

    thresholdDistanceSingleSlide = parseInt(200 / max);
    //disablePageScroll();  //help comments are there in the function definition
},false);

/*
    Give the initial thrust to the slides from the right. I have just given it an effect of the images being
    thrown into the center from the right.
*/
function moveImagesFromRight()
{
    setTimeout(function() {
      document.getElementById("fig1").style.webkitTransform = "translateX(-200px) rotateY(60deg)";
      document.getElementById("fig2").style.webkitTransform = "translateX(-150px) rotateY(60deg)";
      document.getElementById("fig3").style.webkitTransform = "translateX(-100px) rotateY(60deg)";
      document.getElementById("fig4").style.webkitTransform = "translateX(0px) rotateY(0deg) translateZ(200px)";
      document.getElementById("fig5").style.webkitTransform = "translateX(100px) rotateY(-60deg)";
      document.getElementById("fig6").style.webkitTransform = "translateX(150px) rotateY(-60deg)";
      document.getElementById("fig7").style.webkitTransform = "translateX(200px) rotateY(-60deg)";
    }, 100);
}

/* Register touch event listener to the image holders i.e the <div> holding each images */
function addEventsToImageHolders()
{
    var imageHolders = coverFlowContainerElement.getElementsByTagName("div");
    for(var i=0;i<imageHolders.length;i++)
    {
        //console.log(imageHolders[i]);
        imageHolders[i].addEventListener("touchstart",handleImageTapStart,false);
        imageHolders[i].addEventListener("touchend",handleImageTapEnd,false);
    }
}

/*
    Add touch events to the <div id='coverflow' /> container. So the container registers the finger movements
    and acts accordingly
*/
function addEventToCoverflowHolder()
{
    coverFlowContainerElement.addEventListener("touchstart", handleFingerSwipeStart, false);
    coverFlowContainerElement.addEventListener("touchmove", handleFingerSwipeMove, false);
    coverFlowContainerElement.addEventListener("touchend", handleFingerSwipeEnd, false);
}

/* The default behavior of the browser is to scroll when you swipe. This line is to prevent scrolling */
function disablePageScroll() {
  document.ontouchmove = function(event) {
      event.preventDefault();
  }
}

/* Events for the <div id='coverflow'></div> holder */
function handleFingerSwipeStart(event) {
  isMouseDown = true;
  swipeStartX = event.changedTouches[0].pageX;
  event.preventDefault();
}
function handleFingerSwipeMove(event) {
  if (isMouseDown) {
      swipeDistanceX = parseInt(event.changedTouches[0].pageX - swipeStartX);//

      var netDistance = Math.abs(swipeDistanceX);
      //console.log("Move: " + swipeDistanceX + " Net distance: " + netDistance); //changedTouches[0].
      if (netDistance >= thresholdDistanceSingleSlide) {
          //console.log(thresholdDistanceSingleSlide + " covered");
          if (swipeDistanceX < 0) {
              right();
              swipeStartX = event.changedTouches[0].pageX;
          }
          else {
              left();
              swipeStartX = event.changedTouches[0].pageX;
          }
      }
  }
}
function handleFingerSwipeEnd(event) {
  if (isMouseDown) {
      isMouseDown = false;
      swipeStartX = 0;
  }
}

/*
    Events for the <div id="fig"></div> elements where fig starts from 1 to 7. The images are
    inside these element
*/
function handleImageTapStart(event) {
    imageTapStartX = event.changedTouches[0].pageX;
}
function handleImageTapEnd(event) {
    imageTapEndX = event.changedTouches[0].pageX;
    imageTapDistanceX = imageTapEndX - imageTapStartX;
    var targetObj = event.currentTarget;
    if (imageTapDistanceX == 0) {
      clickedIndex = parseInt(targetObj.id.slice(3, 4));
      if (clickedIndex > current) {
          //move right to the clicked index
          diff = clickedIndex - current;
          for (var i = 1; i <= diff; i++) {
              right();
          }
      }
      else if (clickedIndex < current) {
          //move left to the clicked index
          diff = (current - clickedIndex);
          for (var i = 1; i <= diff; i++) {
              left();
          }
      }
      else {
          //same element is clicked....do nothing
      }
    }
}

/* Functions - left() & right() for actually moving the images when user interacts*/
/* Move an image from L -> R i.e you are swiping from L->R across the screen */
function left() {
  if (current > min) {
      current--;

      for (var i = 1; i <= max; i++) {
          currPos = document.getElementById("fig" + i).getAttribute("cp");
          currAngle = document.getElementById("fig" + i).getAttribute("a");
          if (currPos == "-100" || currPos == "0") {
              newPos = parseInt(currPos) + (gap * 2) * (1);
              if (currPos == "0") {
                  newAngle = -60;
              }
              else if (currPos = "-100") {
                  newAngle = 0;
              }
              else {
              }
          }
          else {
              newPos = parseInt(currPos) + (gap) * (1);
              newAngle = parseInt(currAngle);
          }
          if (i == current) {
              document.getElementById("fig" + i).style.webkitTransform = "translateX(" + newPos + "px) rotateY(" + newAngle + "deg) translateZ(200px)";
          }
          else {
              document.getElementById("fig" + i).style.webkitTransform = "translateX(" + newPos + "px) rotateY(" + newAngle + "deg)";
          }
          document.getElementById("fig" + i).setAttribute("cp", newPos);
          document.getElementById("fig" + i).setAttribute("a", newAngle);
      }
  }
}
/* Move an image from R -> L i.e you are swiping from R->L across the screen */
function right() {
  if (current < max) {
      current++;

      for (var i = 1; i <= max; i++) {
          currPos = document.getElementById("fig" + i).getAttribute("cp");
          currAngle = document.getElementById("fig" + i).getAttribute("a");
          if (currPos == "100" || currPos == "0") {
              newPos = parseInt(currPos) + (gap * 2) * (-1);
              if (currPos == "0") {
                  newAngle = 60;
              }
              else if (currPos = "100") {
                  newAngle = 0;
              }
              else {
              }
          }
          else {
              newPos = parseInt(currPos) + (gap) * (-1);
              newAngle = parseInt(currAngle);
          }
          if (i == current) {
              document.getElementById("fig" + i).style.webkitTransform = "translateX(" + newPos + "px) rotateY(" + newAngle + "deg) translateZ(200px)";
          }
          else {
              document.getElementById("fig" + i).style.webkitTransform = "translateX(" + newPos + "px) rotateY(" + newAngle + "deg)";
          }
          document.getElementById("fig" + i).setAttribute("cp", newPos);
          document.getElementById("fig" + i).setAttribute("a", newAngle);
      }
  }
}