
import React, { useState, useEffect } from 'react';
import { JointsCoordinates } from '@/types';

interface SkeletonVisualizationProps {
  joints: JointsCoordinates;
}

const SkeletonVisualization: React.FC<SkeletonVisualizationProps> = ({ joints }) => {
  const [animatedJoints, setAnimatedJoints] = useState<JointsCoordinates>(joints);
  
  // Define bone connections between joints
  const bones = [
    // Torso
    [0, 1], // nose to neck
    [1, 2], // neck to right shoulder
    [1, 5], // neck to left shoulder
    [2, 3], // right shoulder to right elbow
    [3, 4], // right elbow to right wrist
    [5, 6], // left shoulder to left elbow
    [6, 7], // left elbow to left wrist
    [1, 8], // neck to hip center
    [8, 9], // hip center to right hip
    [8, 12], // hip center to left hip
    
    // Right leg
    [9, 10], // right hip to right knee
    [10, 11], // right knee to right ankle
    
    // Left leg
    [12, 13], // left hip to left knee
    [13, 14], // left knee to left ankle
    
    // Head
    [0, 15], // nose to right eye
    [0, 16], // nose to left eye
  ];
  
  // Canvas dimensions and scaling
  const canvasWidth = 300;
  const canvasHeight = 400;
  const scaleFactor = 200; // Scale factor for joint coordinates
  
  // Effect to animate joint positions when they change
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedJoints(joints);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [joints]);
  
  return (
    <div className="relative h-full w-full">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} 
        preserveAspectRatio="xMidYMid meet"
        className="bg-muted-foreground/5 rounded"
      >
        {/* Draw bones first (lines between joints) */}
        {bones.map(([startIdx, endIdx], i) => {
          const startX = canvasWidth / 2 + animatedJoints[startIdx].x * scaleFactor;
          const startY = canvasHeight / 2 + animatedJoints[startIdx].y * scaleFactor;
          const endX = canvasWidth / 2 + animatedJoints[endIdx].x * scaleFactor;
          const endY = canvasHeight / 2 + animatedJoints[endIdx].y * scaleFactor;
          
          return (
            <line
              key={`bone-${i}`}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="rgba(14, 165, 233, 0.7)"
              strokeWidth={3}
              className="bone"
            />
          );
        })}
        
        {/* Draw joints (circles) */}
        {animatedJoints.map((joint, i) => {
          const x = canvasWidth / 2 + joint.x * scaleFactor;
          const y = canvasHeight / 2 + joint.y * scaleFactor;
          
          // Different sizes for different joints
          let radius = 3;
          if (i === 0) radius = 5; // Nose
          else if (i === 1) radius = 5; // Neck
          else if (i === 8) radius = 5; // Hip center
          
          return (
            <circle
              key={`joint-${i}`}
              cx={x}
              cy={y}
              r={radius}
              fill={i === 0 ? "#0ea5e9" : "#0ea5e9"}
              className="joint"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default SkeletonVisualization;
