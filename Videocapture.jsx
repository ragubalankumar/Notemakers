import React, { useState, useRef } from "react";
import { Play, Pause, X } from "lucide-react";

const VideoCapture = ({ onSave, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        chunks.current = [];

        if (onSave) {
          onSave(blob);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-md bg-white mt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Video Capture</h2>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Live Preview */}
      <video ref={videoRef} autoPlay muted className="w-full h-48 border mb-2 rounded-md" />

      {/* Buttons */}
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center gap-2"
        >
          <Play /> <span>Start Recording</span>
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center gap-2"
        >
          <Pause /> <span>Stop Recording</span>
        </button>
      )}

      {/* Recorded Video */}
      {videoUrl && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Recorded Video:</h3>
          <video src={videoUrl} controls className="w-full h-48 mt-2 rounded-md" />
        </div>
      )}
    </div>
  );
};

export default VideoCapture;
