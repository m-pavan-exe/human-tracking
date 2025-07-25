
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stand, Sit, Kneel, Sleep } from '@/components/icons/PoseIcons';

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WiFi-Powered Human Detection</h1>
        <p className="mt-2 text-muted-foreground">
          Human presence and pose detection using WiFi signal processing and deep learning
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stand Detection</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-36 flex items-center justify-center">
              <Stand className="h-32 w-32 text-primary animate-pulse-wifi" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sit Detection</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-36 flex items-center justify-center">
              <Sit className="h-32 w-32 text-primary animate-pulse-wifi" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kneel Detection</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-36 flex items-center justify-center">
              <Kneel className="h-32 w-32 text-primary animate-pulse-wifi" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sleep Detection</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-36 flex items-center justify-center">
              <Sleep className="h-32 w-32 text-primary animate-pulse-wifi" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Technology Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This application leverages WiFi Channel State Information (CSI) to detect human presence and classify poses 
              without cameras, preserving privacy. Using advanced LSTM deep learning models, the system can distinguish 
              between standing, sitting, kneeling, and sleeping positions with high accuracy.
            </p>
            <div className="mt-4 h-32 rounded-md bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">WiFi CSI Processing</div>
                <div className="text-xs text-muted-foreground mt-1">256 subcarriers | Amplitude analysis</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">1</div>
                <p className="text-sm text-muted-foreground">Upload WiFi CSI data in CSV format</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">2</div>
                <p className="text-sm text-muted-foreground">Our LSTM model processes the CSI patterns</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">3</div>
                <p className="text-sm text-muted-foreground">Visualize human presence and predicted pose</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">4</div>
                <p className="text-sm text-muted-foreground">Review joint coordinates for detailed analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
