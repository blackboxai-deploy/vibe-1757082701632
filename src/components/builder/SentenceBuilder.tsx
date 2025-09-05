'use client';

import React, { useState, useEffect } from 'react';
import { Symbol, UserPreferences, SentenceElement } from '@/types';
import { symbolCategories, getAllSymbols } from '@/lib/symbols';
import { getUserPreferences } from '@/lib/storage';
import { speakSentence } from '@/lib/speech';
import SymbolCard from '../communication/SymbolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SentenceSlot {
  id: string;
  position: number;
  symbol: Symbol | null;
  type: 'subject' | 'verb' | 'object' | 'modifier';
}

export default function SentenceBuilder() {
  const [sentenceSlots, setSentenceSlots] = useState<SentenceSlot[]>([]);
  const [availableSymbols, setAvailableSymbols] = useState<Symbol[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  useEffect(() => {
    const userPrefs = getUserPreferences();
    setPreferences(userPrefs);
    setComplexityLevel(userPrefs.complexityLevel);
    initializeSentenceSlots(userPrefs.complexityLevel);
  }, []);

  useEffect(() => {
    setAvailableSymbols(getAllSymbols());
  }, []);

  const initializeSentenceSlots = (level: 'basic' | 'intermediate' | 'advanced') => {
    let slots: SentenceSlot[] = [];

    switch (level) {
      case 'basic':
        // Simple 2-word sentences: Subject + Verb or Verb + Object
        slots = [
          { id: 'slot1', position: 1, symbol: null, type: 'subject' },
          { id: 'slot2', position: 2, symbol: null, type: 'verb' }
        ];
        break;
      case 'intermediate':
        // 3-4 word sentences: Subject + Verb + Object
        slots = [
          { id: 'slot1', position: 1, symbol: null, type: 'subject' },
          { id: 'slot2', position: 2, symbol: null, type: 'verb' },
          { id: 'slot3', position: 3, symbol: null, type: 'object' },
          { id: 'slot4', position: 4, symbol: null, type: 'modifier' }
        ];
        break;
      case 'advanced':
        // 5+ word complex sentences
        slots = [
          { id: 'slot1', position: 1, symbol: null, type: 'modifier' },
          { id: 'slot2', position: 2, symbol: null, type: 'subject' },
          { id: 'slot3', position: 3, symbol: null, type: 'verb' },
          { id: 'slot4', position: 4, symbol: null, type: 'object' },
          { id: 'slot5', position: 5, symbol: null, type: 'modifier' },
          { id: 'slot6', position: 6, symbol: null, type: 'modifier' }
        ];
        break;
    }

    setSentenceSlots(slots);
  };

  const handleSymbolDrop = (symbol: Symbol, slotId: string) => {
    setSentenceSlots(prev => 
      prev.map(slot => 
        slot.id === slotId ? { ...slot, symbol } : slot
      )
    );
  };

  const handleRemoveSymbol = (slotId: string) => {
    setSentenceSlots(prev => 
      prev.map(slot => 
        slot.id === slotId ? { ...slot, symbol: null } : slot
      )
    );
  };

  const getCurrentSentence = () => {
    return sentenceSlots
      .filter(slot => slot.symbol !== null)
      .map(slot => slot.symbol?.text)
      .join(' ');
  };

  const handleSpeakSentence = async () => {
    const sentence = getCurrentSentence();
    if (!sentence) return;

    setIsSpeaking(true);
    try {
      await speakSentence(sentence, preferences?.voiceSettings);
    } catch (error) {
      console.error('Error speaking sentence:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const clearSentence = () => {
    setSentenceSlots(prev => 
      prev.map(slot => ({ ...slot, symbol: null }))
    );
  };

  const getSlotTypeColor = (type: string) => {
    switch (type) {
      case 'subject': return 'bg-blue-100 border-blue-300';
      case 'verb': return 'bg-green-100 border-green-300';
      case 'object': return 'bg-orange-100 border-orange-300';
      case 'modifier': return 'bg-purple-100 border-purple-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getSlotTypeLabel = (type: string) => {
    switch (type) {
      case 'subject': return 'Who/What';
      case 'verb': return 'Action';
      case 'object': return 'What/Where';
      case 'modifier': return 'How/When';
      default: return 'Word';
    }
  };

  const filteredSymbols = activeCategory === 'all' 
    ? availableSymbols 
    : availableSymbols.filter(symbol => symbol.category === activeCategory);

  const complexityFilteredSymbols = filteredSymbols.filter(symbol => {
    switch (complexityLevel) {
      case 'basic':
        return symbol.complexity === 'basic';
      case 'intermediate':
        return symbol.complexity === 'basic' || symbol.complexity === 'intermediate';
      case 'advanced':
        return true;
      default:
        return symbol.complexity === 'basic';
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Sentence Builder</h1>
          <p className="text-gray-600">Build sentences by placing symbols in the correct order</p>
        </div>

        {/* Complexity Level Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Complexity Level:</label>
                <div className="flex space-x-2">
                  {['basic', 'intermediate', 'advanced'].map((level) => (
                    <Button
                      key={level}
                      variant={complexityLevel === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setComplexityLevel(level as any);
                        initializeSentenceSlots(level as any);
                      }}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {sentenceSlots.length} words max
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Sentence Construction Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Build Your Sentence</span>
              <div className="flex space-x-2">
                <Button
                  onClick={handleSpeakSentence}
                  disabled={!getCurrentSentence() || isSpeaking}
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
                <Button variant="outline" onClick={clearSentence}>
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sentence Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {sentenceSlots.map((slot, index) => (
                <div key={slot.id} className="space-y-2">
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}. {getSlotTypeLabel(slot.type)}
                    </Badge>
                  </div>
                  <div
                    className={`
                      min-h-[140px] border-2 border-dashed rounded-lg p-2 
                      ${getSlotTypeColor(slot.type)}
                      ${slot.symbol ? 'border-solid' : ''}
                      transition-all duration-200
                    `}
                  >
                    {slot.symbol ? (
                      <div className="relative">
                        <SymbolCard
                          symbol={slot.symbol}
                          size="small"
                          showText={true}
                        />
                        <button
                          onClick={() => handleRemoveSymbol(slot.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm text-center">
                        Drop symbol here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Sentence Preview */}
            {getCurrentSentence() && (
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your Sentence:</h3>
                <p className="text-xl font-semibold text-blue-800">
                  &quot;{getCurrentSentence()}&quot;
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Symbols */}
        <Card>
          <CardHeader>
            <CardTitle>Available Symbols</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="grid w-full grid-cols-6 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {symbolCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    <span role="img" aria-label={category.name}>{category.icon}</span>
                    <span className="hidden sm:inline ml-1">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeCategory} className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {complexityFilteredSymbols.map((symbol) => (
                    <div
                      key={symbol.id}
                      className="cursor-pointer"
                      onClick={() => {
                        // Find first empty slot to place symbol
                        const emptySlot = sentenceSlots.find(slot => slot.symbol === null);
                        if (emptySlot) {
                          handleSymbolDrop(symbol, emptySlot.id);
                        }
                      }}
                    >
                      <SymbolCard
                        symbol={symbol}
                        size="small"
                        showText={true}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}