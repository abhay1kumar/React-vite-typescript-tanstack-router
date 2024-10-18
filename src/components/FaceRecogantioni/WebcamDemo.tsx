import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";
import { Render } from "../../components/Render.component";
import jsonData from "./abhayFace.json";

interface FacePoint {
  x: number;
  y: number;
  z?: number;
  name?: string; // Some points may not have names
}

const width = 640;
const height = 480;
const tolerance = 15; // Error margin for comparison

const WebcamFaceAuth = (): JSX.Element => {
  const webcamRef = useRef<Webcam>(null);
  const [status, setStatus] = useState<string>("Loading...");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

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

  // Calculate the distance between two points in 3D space (x, y, z)
  const calculateDistance = (p1: FacePoint, p2: FacePoint): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0); // Handle z as optional
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // Check if two points match within the given tolerance
  const isPointMatching = (
    storedPoint: FacePoint,
    detectedPoint: FacePoint
  ): boolean => {
    // Match by name and by distance within tolerance
    if (storedPoint.name !== detectedPoint.name) return false;
    const distance = calculateDistance(storedPoint, detectedPoint);
    return distance <= tolerance;
  };

  // Calculate the match percentage between stored and detected face data
  const calculateMatchPercentage = (
    storedData: FacePoint[],
    detectedData: FacePoint[]
  ): number => {
    let matchedPoints = 0;

    // Loop through each point in the stored data
    for (const storedPoint of storedData) {
      const detectedPoint = detectedData.find(
        (d) => d.name === storedPoint.name // Match by name
      );

      // If a corresponding point is found in the detected data, compare their coordinates
      if (detectedPoint && isPointMatching(storedPoint, detectedPoint)) {
        matchedPoints++; // Count as a match if within tolerance
      }
    }

    // Calculate the percentage of matched points
    const matchPercentage = (matchedPoints / storedData.length) * 100;
    console.log(
      `Matched Points: ${matchedPoints}, Total Points: ${storedData.length}, Match Percentage: ${matchPercentage}`
    );
    return matchPercentage;
  };

  // Scan and compare face data until 90% match is reached
  const scanFaceUntilMatch = (
    storedData: FacePoint[],
    detectedData: FacePoint[],
    targetMatchPercentage: number = 90
  ): { matchedPercentage: number; isMatched: boolean } => {
    const matchPercentage = calculateMatchPercentage(storedData, detectedData);
    const isMatched = matchPercentage >= targetMatchPercentage;

    return {
      matchedPercentage: matchPercentage,
      isMatched: isMatched,
    };
  };

  // Detect face and process keypoints
  const detectFace = useCallback(async (match = false) => {
    if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
      const video = webcamRef.current.video;

      // Load the face landmarks detection model
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
          refineLandmarks: true, // Improve landmark accuracy
        };
      const detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );
      const estimationConfig = { flipHorizontal: false };
      const predictions = await detector.estimateFaces(video, estimationConfig);

      if (predictions.length > 0) {
        const keypoints = predictions[0].keypoints.map(
          (point: { x: number; y: number; z?: number; name?: string }) => ({
            x: point.x,
            y: point.y,
            z: point.z,
            name: point?.name || "",
          })
        );

        if (!match) {
          createAndDownloadJsonFile(keypoints, "face_landmarks9");
          setStatus("Face data stored. Come back to authenticate!");
          setIsCameraOpen(false);
        } else {
          // Compare with the stored face data (jsonData)
          const matching = scanFaceUntilMatch(jsonData, keypoints, 90);
          if (matching.isMatched) {
            setAuthenticated(true);
            setStatus("Face recognized! Access granted.");
            setIsCameraOpen(false);
          } else {
            setStatus(
              `Face not recognized. Match Percentage: ${matching.matchedPercentage.toFixed(2)}%`
            );
          }
        }
      } else {
        setStatus("No face detected.");
      }
    }
  }, []);

  // Continuously detect face every second
  useEffect(() => {
    const interval = setInterval(() => {
      detectFace(true);
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

  return (
    <div>
      <button onClick={createFace}>Save Face</button>
      <button onClick={matchFace}>Match Face</button>
      <h1>{status}</h1>
      {authenticated ? (
        <p>Welcome back! You are authenticated.</p>
      ) : (
        <p>You are not authenticated.</p>
      )}
      <Render if={isCameraOpen}>
        <div style={{ position: "relative", width, height }}>
          <Webcam
            ref={webcamRef}
            style={{ width, height, position: "absolute" }}
            videoConstraints={{ width, height, facingMode: "user" }}
          />
        </div>
      </Render>
    </div>
  );
};

export default WebcamFaceAuth;
