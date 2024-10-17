import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl"; // Ensure this is loaded for the WebGL backend
import { Render } from "../../components/Render.component";
import jsonData from "./abhayFace.json";

interface FacePoint {
  x: number;
  y: number;
  name?: string; // Not all points have a name
}

const width = 640;
const height = 480;
const threshold = 5; // Error margin for comparison

const WebcamFaceAuth = (): JSX.Element => {
  const webcamRef = useRef<Webcam>(null);
  const [status, setStatus] = useState<string>("Loading...");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  // const [matchPercentage, setMatchPercentage] = useState<number>(0);

  // Store keypoints into localStorage
  const createAndDownloadJsonFile = (data: object, fileName: string) => {
    const jsonStr = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Detect face and process keypoints

  // Compare stored and current keypoints
  const compareFaceData = (
    stored: { x: number; y: number }[],
    current: { x: number; y: number }[]
  ): boolean => {
    if (stored.length !== current.length) return false;

    for (let i = 0; i < stored.length; i++) {
      const { x: x1, y: y1 } = stored[i];
      const { x: x2, y: y2 } = current[i];
      const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      if (distance > threshold) {
        return false;
      }
    }
    return true;
  };
  const calculateDistance = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };
  // Function to find a matching point in the detected data
  const isPointMatching = (
    storedPoint: FacePoint,
    detectedPoint: FacePoint,
    tolerance: number
  ): boolean => {
    const distance = calculateDistance(storedPoint, detectedPoint);

    return distance < tolerance;
  };

  // Function to calculate the match percentage between stored and detected face data
  const calculateMatchPercentage = (
    storedData: FacePoint[],
    detectedData: FacePoint[],
    tolerance: number
  ): number => {
    let matchedPoints = 0;

    // Loop through each point in the stored data
    for (const storedPoint of storedData) {
      const detectedPoint = detectedData.find(
        (d) => d.name === storedPoint.name
      );

      // If a corresponding point is found in the detected data, compare their coordinates
      if (
        detectedPoint &&
        isPointMatching(storedPoint, detectedPoint, tolerance)
      ) {
        matchedPoints++; // Count as a match if within tolerance
      }
    }

    // Calculate the percentage of matched points
    const matchPercentage = (matchedPoints / storedData.length) * 100;
    console.log(
      `Matched Points: ${matchedPoints}, Total Points: ${storedData.length}, Match Percentage: ${matchPercentage}`
    );
    // debugger;
    return matchPercentage;
  };

  // Main function to scan and keep comparing until 90% match is reached
  const scanFaceUntilMatch = (
    storedData: FacePoint[],
    detectedData: FacePoint[],
    tolerance: number,
    targetMatchPercentage: number
  ): { matchedPercentage: number; isMatched: boolean } => {
    const matchPercentage = calculateMatchPercentage(
      storedData,
      detectedData,
      tolerance
    );

    // Check if the match percentage has reached or exceeded the target
    const isMatched = matchPercentage >= targetMatchPercentage;

    return {
      matchedPercentage: matchPercentage,
      isMatched: isMatched,
    };
  };

  const detectFace = useCallback(async (match = false) => {
    if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
      const video = webcamRef.current.video;

      // Load the face landmarks detection model
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
        {
          runtime: "mediapipe", // Strictly type as "mediapipe"
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
          refineLandmarks: true, // Optional: Improve landmark accuracy
        };
      const detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );
      // Get face predictions
      const estimationConfig = { flipHorizontal: false };
      const predictions = await detector.estimateFaces(video, estimationConfig);

      console.log("predictions", predictions);
      if (predictions.length > 0) {
        const keypoints = predictions[0].keypoints.map(
          (point: { x: number; y: number; name?: string }) => ({
            x: point.x,
            y: point.y,
            name: point.name,
          })
        );
        if (!match) {
          createAndDownloadJsonFile(keypoints, "face_landmarks9");
          setStatus("Face data stored. Come back to authenticate!");
          setIsCameraOpen(false);
        } else {
          // const storedKeypoints = [{ x: 12, y: 10 }];
          const isMatch = compareFaceData(jsonData, keypoints);
          const matching = scanFaceUntilMatch(jsonData, keypoints, 15, 90);
          console.log("firmatchingst", matching);
          console.log("firmatchingst__isMatch", isMatch);
          if (matching.isMatched) {
            setAuthenticated(true);
            setStatus("Face recognized! Access granted.");
            setIsCameraOpen(false);
          } else {
            setStatus("Face not recognized. Access denied.");
            // setIsCameraOpen(false);
          }
        }
      } else {
        setStatus("No face detected.");
        setIsCameraOpen(false);
      }
    }
  }, []);
  // // Detect face at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      detectFace(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [detectFace]);

  const matchFace = () => {
    setIsCameraOpen(true);
    detectFace(true);
  };
  const createFace = () => {
    setIsCameraOpen(true);
    detectFace(false);
  };

  console.log("jsondata", jsonData);
  return (
    <div>
      <button onClick={createFace}>Save Face</button>
      <button onClick={matchFace}>Match Face</button>
      <h1>{status}</h1>
      {authenticated ? (
        <p>Welcome back! You are authenticated.</p>
      ) : (
        <p> You are not authenticated.</p>
      )}
      <Render if={isCameraOpen}>
        <div style={{ position: "relative", width, height }}>
          <Webcam
            ref={webcamRef}
            style={{
              width,
              height,
              position: "absolute",
            }}
            videoConstraints={{
              width,
              height,
              facingMode: "user",
            }}
          />
        </div>
      </Render>
    </div>
  );
};

export default WebcamFaceAuth;
