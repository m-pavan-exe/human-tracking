
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import SkeletonVisualization from '@/components/visualization/SkeletonVisualization';
import { mockPrediction } from '@/services/mockData';
import { PredictionResult } from '@/types';
import PredictionDetails from '@/components/visualization/PredictionDetails';

const API_BASE_URL = 'http://localhost:5000';

const Prediction: React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      if (selectedFile.type !== 'text/csv') {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file.",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    
    // Create progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90; // Hold at 90% until actual completion
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Send to backend API
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process data');
      }
      
      const predictionResult = await response.json();
      clearInterval(progressInterval);
      setProgress(100);
      setIsLoading(false);
      
      setResult(predictionResult);
      
      toast({
        title: "Analysis complete",
        description: "The WiFi CSI data has been processed successfully."
      });
      
    } catch (error) {
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
      
      console.error('Error processing data:', error);
      toast({
        title: "Processing error",
        description: error instanceof Error ? error.message : "Failed to process the data.",
        variant: "destructive"
      });
    }
  };
  
  const handleMockData = () => {
    setIsLoading(true);
    setProgress(0);
    
    // Mock progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Use mock data for testing without backend
    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setProgress(100);
      
      // Use mock data for now - would be replaced with actual API call
      setResult(mockPrediction());
      
      toast({
        title: "Mock Analysis Complete",
        description: "Using simulated data for demonstration."
      });
    }, 1500);
  };
  
  const resetForm = () => {
    setFile(null);
    setIsLoading(false);
    setProgress(0);
    setResult(null);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prediction Tool</h1>
        <p className="mt-2 text-muted-foreground">
          Upload WiFi CSI data to detect human presence and pose
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Upload</CardTitle>
            <CardDescription>
              Upload CSV files containing WiFi CSI data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <>
                <div className="mb-6 flex items-center justify-center">
                  <label htmlFor="dropzone-file" className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="mb-2 h-6 w-6 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">CSV files only</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      className="hidden" 
                      accept=".csv"
                      onChange={handleFileChange}
                      disabled={isLoading} 
                    />
                  </label>
                </div>
                
                {file && (
                  <div className="mb-4 rounded-md bg-muted p-3">
                    <div className="text-sm font-medium">Selected file:</div>
                    <div className="text-sm text-muted-foreground">{file.name}</div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Processing data...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button 
                    disabled={!file || isLoading} 
                    onClick={handleUpload} 
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : "Process Data"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-3">
                  <PredictionDetails result={result} />
                </div>
                <Button onClick={resetForm} variant="outline" className="w-full">
                  Upload Another File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pose Visualization</CardTitle>
            <CardDescription>
              Real-time visualization of detected human pose
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-md bg-muted flex items-center justify-center">
              {result ? (
                <SkeletonVisualization joints={result.jointCoordinates} />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">No data to visualize</p>
                  <p className="text-xs">Upload a CSV file to see results</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Prediction;
