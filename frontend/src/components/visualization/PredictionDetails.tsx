
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PredictionResult } from '@/types';

interface PredictionDetailsProps {
  result: PredictionResult;
}

const PredictionDetails: React.FC<PredictionDetailsProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-sm font-medium">Human Presence</div>
        <Badge 
          variant={result.humanPresence ? "default" : "outline"}
          className={result.humanPresence ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {result.humanPresence ? "Detected" : "Not Detected"}
        </Badge>
      </div>
      
      {result.humanPresence && (
        <>
          <div className="space-y-1">
            <div className="text-sm font-medium">Predicted Pose</div>
            <Badge 
              className="bg-primary hover:bg-primary/90"
            >
              {result.pose}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Confidence</div>
            <div className="text-sm">{(result.confidence * 100).toFixed(2)}%</div>
          </div>
        </>
      )}
      
      <div className="space-y-1">
        <div className="text-sm font-medium">Processed Timestamp</div>
        <div className="text-xs text-muted-foreground">{new Date().toISOString()}</div>
      </div>
    </div>
  );
};

export default PredictionDetails;
