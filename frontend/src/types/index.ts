
export interface Coordinate {
  x: number;
  y: number;
}

export type JointsCoordinates = Coordinate[];

export type PoseType = 'Stand' | 'Sit' | 'Kneel' | 'Sleep' | 'None';

export interface PredictionResult {
  humanPresence: boolean;
  pose: PoseType;
  confidence: number;
  jointCoordinates: JointsCoordinates;
}
