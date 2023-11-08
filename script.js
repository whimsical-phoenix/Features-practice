const video = document.getElementById("video");
const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

startButton.addEventListener("click", startFaceUnlock);

async function startFaceUnlock() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    // Load face-api.js models
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

    // Start face detection
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      if (detections.length > 0) {
        message.textContent = "Face Detected - Screen Unlocked";
        message.style.color = "green";
      } else {
        message.textContent = "No Face Detected";
        message.style.color = "red";
      }
    }, 1000);
  } catch (error) {
    console.error("Error accessing webcam:", error);
    message.textContent = "Error accessing webcam";
    message.style.color = "red";
  }
}
