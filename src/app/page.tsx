'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import CommunicationBoard from '@/components/communication/CommunicationBoard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header 
          title="Communication Board"
          subtitle="Select symbols to express yourself and build sentences"
          showEmergency={true}
        />
        
        <Navigation />
        
        <CommunicationBoard />
      </div>
    </div>
  );
}