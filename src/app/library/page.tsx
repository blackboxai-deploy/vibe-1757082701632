'use client';

import React, { useState, useEffect } from 'react';
import { PersonalPhrase } from '@/types';
import { getPersonalPhrases, savePersonalPhrase, StorageService } from '@/lib/storage';
import { speakSentence } from '@/lib/speech';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function PersonalPhrasesPage() {
  const [phrases, setPhrases] = useState<PersonalPhrase[]>([]);
  const [newPhrase, setNewPhrase] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    loadPhrases();
  }, []);

  const loadPhrases = () => {
    const savedPhrases = getPersonalPhrases();
    setPhrases(savedPhrases);
  };

  const addPhrase = async () => {
    if (!newPhrase.trim()) return;

    setIsAdding(true);
    try {
      const phrase: PersonalPhrase = {
        id: Date.now().toString(),
        text: newPhrase.trim(),
        category: newCategory,
        frequency: 0,
        lastUsed: new Date()
      };

      savePersonalPhrase(phrase);
      loadPhrases();
      setNewPhrase('');
      setNewCategory('general');
    } catch (error) {
      console.error('Error adding phrase:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const deletePhrase = (phraseId: string) => {
    StorageService.deletePersonalPhrase(phraseId);
    loadPhrases();
  };

  const speakPhrase = async (phrase: PersonalPhrase) => {
    setSpeakingId(phrase.id);
    try {
      await speakSentence(phrase.text);
      
      // Update frequency and last used
      const updatedPhrase = {
        ...phrase,
        frequency: phrase.frequency + 1,
        lastUsed: new Date()
      };
      savePersonalPhrase(updatedPhrase);
      loadPhrases();
    } catch (error) {
      console.error('Error speaking phrase:', error);
    } finally {
      setSpeakingId(null);
    }
  };

  const getCategories = () => {
    const categories = new Set(phrases.map(p => p.category));
    return Array.from(categories);
  };

  const filteredPhrases = filterCategory === 'all' 
    ? phrases 
    : phrases.filter(p => p.category === filterCategory);

  const sortedPhrases = filteredPhrases.sort((a, b) => {
    // Sort by frequency (most used first), then by last used
    if (a.frequency !== b.frequency) {
      return b.frequency - a.frequency;
    }
    return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
  });

  const predefinedPhrases = [
    { text: "I need help", category: "assistance" },
    { text: "Thank you very much", category: "social" },
    { text: "I am tired", category: "feelings" },
    { text: "I want to go home", category: "activities" },
    { text: "Please call my family", category: "assistance" },
    { text: "I feel better now", category: "feelings" },
    { text: "Can you repeat that", category: "communication" },
    { text: "I don't understand", category: "communication" },
    { text: "I love you", category: "social" },
    { text: "Good morning", category: "social" },
    { text: "I am hungry", category: "needs" },
    { text: "I am in pain", category: "health" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header 
          title="Personal Phrases"
          subtitle="Save and organize your frequently used phrases"
          showEmergency={false}
        />
        
        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add New Phrase */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span role="img" aria-label="Add">➕</span>
                <span>Add New Phrase</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-phrase">Phrase Text</Label>
                <Input
                  id="new-phrase"
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  placeholder="Enter your phrase..."
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="needs">Basic Needs</SelectItem>
                    <SelectItem value="feelings">Feelings</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="assistance">Assistance</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="activities">Activities</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={addPhrase}
                disabled={!newPhrase.trim() || isAdding}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add Phrase'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Saved Phrases */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <span role="img" aria-label="Library">📚</span>
                  <span>Your Saved Phrases ({sortedPhrases.length})</span>
                </CardTitle>
                
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Filter:</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {getCategories().map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedPhrases.length > 0 ? (
                  sortedPhrases.map((phrase) => (
                    <div key={phrase.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-800">{phrase.text}</p>
                          <Badge variant="outline" className="text-xs">
                            {phrase.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Used {phrase.frequency} times</span>
                          <span>Last used: {new Date(phrase.lastUsed).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => speakPhrase(phrase)}
                          disabled={speakingId === phrase.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {speakingId === phrase.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            '🔊'
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePhrase(phrase.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No saved phrases yet.</p>
                    <p className="text-sm mt-1">Add your first phrase above or try some suggestions below.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Phrases */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span role="img" aria-label="Suggestions">💡</span>
                <span>Suggested Phrases</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {predefinedPhrases.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{suggestion.text}</p>
                      <p className="text-xs text-gray-500">{suggestion.category}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const phrase: PersonalPhrase = {
                          id: Date.now().toString() + index,
                          text: suggestion.text,
                          category: suggestion.category,
                          frequency: 0,
                          lastUsed: new Date()
                        };
                        savePersonalPhrase(phrase);
                        loadPhrases();
                      }}
                      className="text-xs"
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}