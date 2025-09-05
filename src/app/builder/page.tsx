'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import SentenceBuilder from '@/components/builder/SentenceBuilder';

export default function SentenceBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header 
          title="Sentence Builder"
          subtitle="Build complex sentences with structured grammar support"
          showEmergency={true}
        />
        
        <Navigation />
        
        <SentenceBuilder />
      </div>
    </div>
  );
}