'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showEmergency?: boolean;
}

export default function Header({ 
  title = "Aphasia Communication App", 
  subtitle = "Helping you communicate with confidence",
  showEmergency = true 
}: HeaderProps) {

  const handleEmergency = () => {
    // Emergency communication - speak immediately
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("I need help now. This is an emergency.");
      utterance.rate = 1.2;
      utterance.volume = 1;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    
    // Could also trigger emergency contacts, alerts, etc.
    alert("Emergency alert activated! Speaking 'I need help now.'");
  };

  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="text-4xl" role="img" aria-label="Communication">
                💬
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {title}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>
          
          {showEmergency && (
            <div className="ml-4">
              <Button
                onClick={handleEmergency}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg font-bold shadow-lg"
                size="lg"
              >
                <span className="mr-2" role="img" aria-label="Emergency">🚨</span>
                HELP
              </Button>
            </div>
          )}
        </div>
        
        {/* Quick Status Bar */}
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Speech Ready</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Symbols Loaded</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Settings Saved</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}