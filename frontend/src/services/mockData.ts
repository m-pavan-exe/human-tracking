
import { PredictionResult, PoseType } from '@/types';

// Generate random joint coordinates based on pose type
const generateJoints = (poseType: PoseType) => {
  // Base positions for 17 joints (x, y)
  // Order: nose, neck, r_shoulder, r_elbow, r_wrist, l_shoulder, l_elbow, l_wrist, 
  //        hip_center, r_hip, r_knee, r_ankle, l_hip, l_knee, l_ankle, r_eye, l_eye
  
  let basePositions;
  
  switch (poseType) {
    case 'Stand':
      basePositions = [
        { x: 0, y: -0.7 },   // nose
        { x: 0, y: -0.5 },   // neck
        { x: 0.2, y: -0.5 }, // right shoulder
        { x: 0.4, y: -0.3 }, // right elbow
        { x: 0.6, y: -0.1 }, // right wrist
        { x: -0.2, y: -0.5 }, // left shoulder
        { x: -0.4, y: -0.3 }, // left elbow
        { x: -0.6, y: -0.1 }, // left wrist
        { x: 0, y: 0 },       // hip center
        { x: 0.1, y: 0 },     // right hip
        { x: 0.15, y: 0.4 },  // right knee
        { x: 0.2, y: 0.8 },   // right ankle
        { x: -0.1, y: 0 },    // left hip
        { x: -0.15, y: 0.4 }, // left knee
        { x: -0.2, y: 0.8 },  // left ankle
        { x: 0.05, y: -0.75 }, // right eye
        { x: -0.05, y: -0.75 } // left eye
      ];
      break;
      
    case 'Sit':
      basePositions = [
        { x: 0, y: -0.4 },    // nose
        { x: 0, y: -0.2 },    // neck
        { x: 0.2, y: -0.2 },  // right shoulder
        { x: 0.4, y: 0 },     // right elbow
        { x: 0.5, y: 0.2 },   // right wrist
        { x: -0.2, y: -0.2 }, // left shoulder
        { x: -0.4, y: 0 },    // left elbow
        { x: -0.5, y: 0.2 },  // left wrist
        { x: 0, y: 0.3 },     // hip center
        { x: 0.15, y: 0.3 },  // right hip
        { x: 0.2, y: 0.6 },   // right knee
        { x: 0.1, y: 0.9 },   // right ankle
        { x: -0.15, y: 0.3 }, // left hip
        { x: -0.2, y: 0.6 },  // left knee
        { x: -0.1, y: 0.9 },  // left ankle
        { x: 0.05, y: -0.45 }, // right eye
        { x: -0.05, y: -0.45 } // left eye
      ];
      break;
      
    case 'Kneel':
      basePositions = [
        { x: 0, y: -0.3 },    // nose
        { x: 0, y: -0.1 },    // neck
        { x: 0.2, y: -0.1 },  // right shoulder
        { x: 0.4, y: 0.1 },   // right elbow
        { x: 0.5, y: 0.3 },   // right wrist
        { x: -0.2, y: -0.1 }, // left shoulder
        { x: -0.4, y: 0.1 },  // left elbow
        { x: -0.5, y: 0.3 },  // left wrist
        { x: 0, y: 0.3 },     // hip center
        { x: 0.15, y: 0.3 },  // right hip
        { x: 0.1, y: 0.7 },   // right knee
        { x: 0.2, y: 0.9 },   // right ankle
        { x: -0.15, y: 0.3 }, // left hip
        { x: -0.05, y: 0.6 }, // left knee
        { x: -0.1, y: 0.4 },  // left ankle
        { x: 0.05, y: -0.35 }, // right eye
        { x: -0.05, y: -0.35 } // left eye
      ];
      break;
      
    case 'Sleep':
      basePositions = [
        { x: -0.7, y: 0 },    // nose
        { x: -0.5, y: 0 },    // neck
        { x: -0.3, y: 0.2 },  // right shoulder
        { x: -0.1, y: 0.3 },  // right elbow
        { x: 0.1, y: 0.4 },   // right wrist
        { x: -0.3, y: -0.2 }, // left shoulder
        { x: -0.1, y: -0.3 }, // left elbow
        { x: 0.1, y: -0.4 },  // left wrist
        { x: 0, y: 0 },       // hip center
        { x: 0.2, y: 0.1 },   // right hip
        { x: 0.4, y: 0.15 },  // right knee
        { x: 0.7, y: 0.2 },   // right ankle
        { x: 0.2, y: -0.1 },  // left hip
        { x: 0.4, y: -0.15 }, // left knee
        { x: 0.7, y: -0.2 },  // left ankle
        { x: -0.75, y: 0.05 }, // right eye
        { x: -0.75, y: -0.05 } // left eye
      ];
      break;
      
    default:
      basePositions = Array(17).fill({ x: 0, y: 0 });
  }
  
  // Add slight random variations to make each pose unique
  return basePositions.map(pos => ({
    x: pos.x + (Math.random() - 0.5) * 0.1, // add +/- 0.05 variation
    y: pos.y + (Math.random() - 0.5) * 0.1  // add +/- 0.05 variation
  }));
};

export const mockPrediction = (): PredictionResult => {
  // Randomly decide if human is present (90% chance yes for demo purposes)
  const humanPresent = Math.random() < 0.9;
  
  if (!humanPresent) {
    return {
      humanPresence: false,
      pose: 'None',
      confidence: 0.95 + Math.random() * 0.05, // High confidence for "no human" (0.95-1.0)
      jointCoordinates: Array(17).fill({ x: 0, y: 0 }) // Empty joints
    };
  }
  
  // Pick a random pose
  const poses: PoseType[] = ['Stand', 'Sit', 'Kneel', 'Sleep'];
  const selectedPose = poses[Math.floor(Math.random() * poses.length)];
  
  // Generate confidence level (0.7-1.0)
  const confidence = 0.7 + Math.random() * 0.3;
  
  // Generate joint coordinates based on the pose
  const jointCoordinates = generateJoints(selectedPose);
  
  return {
    humanPresence: true,
    pose: selectedPose,
    confidence,
    jointCoordinates
  };
};
