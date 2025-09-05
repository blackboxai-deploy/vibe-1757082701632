'use client';

import React, { useState, useEffect } from 'react';
import { Symbol, UserPreferences } from '@/types';
import { symbolCategories } from '@/lib/symbols';
import { getUserPreferences } from '@/lib/storage';
import CategoryGrid from './CategoryGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { speakSentence } from '@/lib/speech';

export default function CommunicationBoard() {
  const [selectedSymbols, setSelectedSymbols] = useState<Symbol[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activeCategory, setActiveCategory] = useState('basic-needs');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const userPrefs = getUserPreferences();
    setPreferences(userPrefs);
  }, []);

  const handleSymbolSelect = (symbol: Symbol) => {
    setSelectedSymbols(prev => {
      const isAlreadySelected = prev.find(s => s.id === symbol.id);
      
      if (isAlreadySelected) {
        // Remove if already selected
        return prev.filter(s => s.id !== symbol.id);
      } else {
        // Add to selection
        return [...prev, symbol];
      }
    });
  };

  const handleSpeakSentence = async () => {
    if (selectedSymbols.length === 0) return;

    setIsSpeaking(true);
    try {
      const sentence = selectedSymbols.map(symbol => symbol.text).join(' ');
      await speakSentence(sentence, preferences?.voiceSettings);
    } catch (error) {
      console.error('Error speaking sentence:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const clearSelection = () => {
    setSelectedSymbols([]);
  };

  const getCurrentSentence = () => {
    return selectedSymbols.map(symbol => symbol.text).join(' ');
  };

  // Filter categories based on user preferences
  const availableCategories = symbolCategories.filter(category =>
    preferences?.categories.includes(category.id) ?? true
  );

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Communication Board</h1>
          <p className="text-gray-600">Select symbols to build sentences and communicate</p>
        </div>

        {/* Selected Symbols & Sentence Display */}
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Your Sentence</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSpeakSentence}
                    disabled={selectedSymbols.length === 0 || isSpeaking}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSpeaking ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Speaking...
                      </>
                    ) : (
                      <>🔊 Speak</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearSelection}
                    disabled={selectedSymbols.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Selected symbols display */}
              <div className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                {selectedSymbols.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedSymbols.map((symbol, index) => (
                        <div
                          key={`${symbol.id}-${index}`}
                          className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg border border-blue-300"
                        >
                          <span className="font-medium text-blue-800">{symbol.text}</span>
                          <button
                            onClick={() => setSelectedSymbols(prev => prev.filter((_, i) => i !== index))}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-lg font-medium text-gray-800">
                        &quot;{getCurrentSentence()}&quot;
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Select symbols below to build your sentence</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symbol Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {availableCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center space-x-1 text-sm"
              >
                <span role="img" aria-label={category.name}>{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {availableCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <CategoryGrid
                category={category}
                onSymbolSelect={handleSymbolSelect}
                selectedSymbols={selectedSymbols.map(s => s.id)}
                complexityLevel={preferences.complexityLevel}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              // Add common phrase functionality
              setSelectedSymbols([
                { id: 'help', text: 'Help', category: 'basic-needs', imageUrl: '', complexity: 'basic' }
              ]);
            }}
            className="px-6 py-3"
          >
            I need help
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedSymbols([
                { id: 'water', text: 'Water', category: 'basic-needs', imageUrl: '', complexity: 'basic' }
              ]);
            }}
            className="px-6 py-3"
          >
            I want water
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedSymbols([
                { id: 'happy', text: 'Happy', category: 'emotions', imageUrl: '', complexity: 'basic' }
              ]);
            }}
            className="px-6 py-3"
          >
            I am happy
          </Button>
        </div>
      </div>
    </div>
  );
}