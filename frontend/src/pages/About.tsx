
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About the Project</h1>
        <p className="mt-2 text-muted-foreground">
          Understanding WiFi-powered human detection technology
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                This project implements a WiFi-powered human presence and pose detection system
                using Channel State Information (CSI) from WiFi signals. The system can detect
                if a person is present in a space and determine their pose (standing, sitting,
                kneeling, or sleeping) without using cameras, preserving privacy.
              </p>
              <p>
                The core of the system is a Long Short-Term Memory (LSTM) neural network trained on
                synthetic WiFi CSI data with corresponding human pose information. The model analyzes
                fluctuations in WiFi signals caused by human movements and bodies to make predictions.
              </p>
              <p>
                Each pose is associated with 17 joint coordinates, enabling the system to visualize
                a skeleton representation of the detected human pose, providing a more intuitive
                understanding of the detection results.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mr-2 h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                <div className="text-sm">
                  <div className="font-medium">Dataset</div>
                  <p className="text-muted-foreground">
                    Synthetic dataset with 6,000 samples representing WiFi CSI data across 256 subcarriers
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                <div className="text-sm">
                  <div className="font-medium">Model Architecture</div>
                  <p className="text-muted-foreground">
                    LSTM neural network optimized for time-series WiFi signal processing
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-2 w-2 translate-y-1.5 rounded-full bg-primary" />
                <div className="text-sm">
                  <div className="font-medium">Pose Categories</div>
                  <p className="text-muted-foreground">
                    Standing, Sitting, Kneeling, Sleeping, and No Human Presence
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-6">
            <div>
              <h3 className="mb-2 text-lg font-medium">Frontend</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>React.js for UI components</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Tailwind CSS for styling</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>Interactive skeleton visualization</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span>CSV file upload and processing</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">Backend</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Flask server for API endpoints</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>CSV parsing and validation</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>LSTM model loading and inference</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>Result formatting and delivery</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-medium">ML Pipeline</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Synthetic data generation</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>LSTM model training and validation</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Model serialization and optimization</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Joint coordinate mapping</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
