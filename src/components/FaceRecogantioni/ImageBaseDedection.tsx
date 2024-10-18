import { useState, useCallback } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl"; // Ensure TensorFlow.js backend is available
import jsonData from "./abhayFace.json"; // Stored face data for comparison

interface FacePoint {
  x: number;
  y: number;
  name?: string; // Some points may not have names
}

const tolerance = 15; // Error margin for comparison

const ImageFaceAuth = (): JSX.Element => {
  const [status, setStatus] = useState<string>("Loading...");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Store keypoints into localStorage or download as JSON
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

  // Calculate the distance between two points in 2D space (x, y)
  const calculateDistance = (p1: FacePoint, p2: FacePoint): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check if two points match within the given tolerance
  const isPointMatching = (
    storedPoint: FacePoint,
    detectedPoint: FacePoint
  ): boolean => {
    if (storedPoint.name !== detectedPoint.name) return false; // Match based on name
    const distance = calculateDistance(storedPoint, detectedPoint);
    return distance < tolerance;
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
        (d) => d.name === storedPoint.name
      );
      if (detectedPoint && isPointMatching(storedPoint, detectedPoint)) {
        matchedPoints++; // Count as a match if within tolerance
      } else {
        console.log("detectedPoint", detectedPoint);
        console.log("detectedPoint_storedPoint", storedPoint);
        debugger
        console.log(`Mismatch: Stored Point ${storedPoint.name} did not match`);
      }
    }

    // Calculate the percentage of matched points
    const matchPercentage = (matchedPoints / storedData.length) * 100;
    console.log(
      `Matched Points: ${matchedPoints}, Total Points: ${storedData.length}, Match Percentage: ${matchPercentage}`
    );
    return matchPercentage;
  };

  // Handle image upload and set the uploaded image to state
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setUploadedImage(imageUrl); // Store image URL
      setStatus("Image uploaded. Ready to scan.");
    }
  };

  // Detect face landmarks from the uploaded image
  const detectFace = useCallback(
    async (match = false) => {
      if (uploadedImage) {
        // Load image into an HTML Image element
        const img = new Image();
        img.src = uploadedImage;
        img.onload = async () => {
          // Load the face landmarks detection model
          const model =
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
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

          // Get face predictions
          const predictions = await detector.estimateFaces(img);

          if (predictions.length > 0) {
            const keypoints = predictions[0].keypoints.map(
              (point: { x: number; y: number; name?: string }) => ({
                x: point.x,
                y: point.y,
                name: point.name || "",
              })
            );

            if (!match) {
              createAndDownloadJsonFile(keypoints, "face_landmarks_image");
              setStatus(
                "Face data stored from image. Come back to authenticate."
              );
            } else {
              // Compare with the stored face data (jsonData)
              const matchPercentage = calculateMatchPercentage(
                jsonData,
                keypoints
              );
              if (matchPercentage >= 90) {
                setAuthenticated(true);
                setStatus("Face recognized! Access granted.");
              } else {
                setStatus(
                  `Face not recognized. Match Percentage: ${matchPercentage.toFixed(2)}%`
                );
              }
            }
          } else {
            setStatus("No face detected in the image.");
          }
        };
      }
    },
    [uploadedImage]
  );

  const matchFace = () => {
    if (uploadedImage) {
      detectFace(true);
    } else {
      setStatus("Please upload an image first.");
    }
  };

  const createFace = () => {
    if (uploadedImage) {
      detectFace(false);
    } else {
      setStatus("Please upload an image first.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={createFace}>Save Face</button>
      <button onClick={matchFace}>Match Face</button>
      <h1>{status}</h1>
      {authenticated ? (
        <p>Welcome back! You are authenticated.</p>
      ) : (
        <p>You are not authenticated.</p>
      )}
      {uploadedImage && (
        <div>
          <img
            src={uploadedImage}
            alt="Uploaded Face"
            style={{ width: 300, height: 300 }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageFaceAuth;
