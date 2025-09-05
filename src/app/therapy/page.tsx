'use client';

import React, { useState, useEffect } from 'react';
import { Symbol, ProgressData } from '@/types';
import { getAllSymbols, getSymbolsByComplexity } from '@/lib/symbols';
import { getProgressData, StorageService } from '@/lib/storage';
import { speakSentence } from '@/lib/speech';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import SymbolCard from '@/components/communication/SymbolCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TherapyExercise {
  id: string;
  type: 'symbol_recognition' | 'sentence_building' | 'category_matching';
  question: string;
  options: Symbol[];
  correctAnswer: Symbol;
  completed: boolean;
  correct: boolean;
  timeSpent: number;
}

export default function TherapyPage() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [currentExercise, setCurrentExercise] = useState<TherapyExercise | null>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [exerciseType, setExerciseType] = useState<'symbol_recognition' | 'sentence_building' | 'category_matching'>('symbol_recognition');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const data = getProgressData();
    setProgressData(data);
  };

  const generateSymbolRecognitionExercise = (): TherapyExercise => {
    const allSymbols = getAllSymbols();
    const randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
    
    // Create 3 incorrect options + 1 correct
    const otherSymbols = allSymbols.filter(s => s.id !== randomSymbol.id);
    const incorrectOptions = [];
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * otherSymbols.length);
      incorrectOptions.push(otherSymbols.splice(randomIndex, 1)[0]);
    }
    
    const allOptions = [randomSymbol, ...incorrectOptions].sort(() => Math.random() - 0.5);
    
    return {
      id: Date.now().toString(),
      type: 'symbol_recognition',
      question: `Which symbol represents "${randomSymbol.text}"?`,
      options: allOptions,
      correctAnswer: randomSymbol,
      completed: false,
      correct: false,
      timeSpent: 0
    };
  };

  const generateCategoryMatchingExercise = (): TherapyExercise => {
    const allSymbols = getAllSymbols();
    const categories = ['basic-needs', 'emotions', 'actions', 'people', 'places'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const categorySymbols = allSymbols.filter(s => s.category === randomCategory);
    const otherSymbols = allSymbols.filter(s => s.category !== randomCategory);
    
    if (categorySymbols.length === 0) return generateSymbolRecognitionExercise();
    
    const correctSymbol = categorySymbols[Math.floor(Math.random() * categorySymbols.length)];
    const incorrectOptions = [];
    for (let i = 0; i < 3; i++) {
      if (otherSymbols.length > i) {
        incorrectOptions.push(otherSymbols[i]);
      }
    }
    
    const allOptions = [correctSymbol, ...incorrectOptions].sort(() => Math.random() - 0.5);
    
    const categoryNames: { [key: string]: string } = {
      'basic-needs': 'Basic Needs',
      'emotions': 'Emotions',
      'actions': 'Actions',
      'people': 'People',
      'places': 'Places'
    };
    
    return {
      id: Date.now().toString(),
      type: 'category_matching',
      question: `Which symbol belongs to the "${categoryNames[randomCategory]}" category?`,
      options: allOptions,
      correctAnswer: correctSymbol,
      completed: false,
      correct: false,
      timeSpent: 0
    };
  };

  const generateSentenceBuildingExercise = (): TherapyExercise => {
    const basicSymbols = getSymbolsByComplexity('basic');
    const subjects = basicSymbols.filter(s => s.category === 'people' || s.text === 'I');
    const actions = basicSymbols.filter(s => s.category === 'actions');
    
    if (subjects.length === 0 || actions.length === 0) return generateSymbolRecognitionExercise();
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    const sentence = `${subject.text} ${action.text}`;
    
    return {
      id: Date.now().toString(),
      type: 'sentence_building',
      question: `Select the symbol that would complete: "${subject.text} ___"`,
      options: [action, ...basicSymbols.filter(s => s.id !== action.id).slice(0, 3)].sort(() => Math.random() - 0.5),
      correctAnswer: action,
      completed: false,
      correct: false,
      timeSpent: 0
    };
  };

  const startTherapySession = () => {
    setIsActive(true);
    setScore(0);
    setTotalExercises(0);
    setShowResults(false);
    generateNextExercise();
  };

  const generateNextExercise = () => {
    let exercise: TherapyExercise;
    
    switch (exerciseType) {
      case 'symbol_recognition':
        exercise = generateSymbolRecognitionExercise();
        break;
      case 'category_matching':
        exercise = generateCategoryMatchingExercise();
        break;
      case 'sentence_building':
        exercise = generateSentenceBuildingExercise();
        break;
      default:
        exercise = generateSymbolRecognitionExercise();
    }
    
    setCurrentExercise(exercise);
    setExerciseStartTime(Date.now());
  };

  const handleAnswer = async (selectedSymbol: Symbol) => {
    if (!currentExercise) return;
    
    const timeSpent = Date.now() - exerciseStartTime;
    const isCorrect = selectedSymbol.id === currentExercise.correctAnswer.id;
    
    const updatedExercise = {
      ...currentExercise,
      completed: true,
      correct: isCorrect,
      timeSpent
    };
    
    setCurrentExercise(updatedExercise);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      // Speak positive feedback
      await speakSentence("Correct! Well done.");
    } else {
      // Speak the correct answer
      await speakSentence(`The correct answer is ${currentExercise.correctAnswer.text}`);
    }
    
    setTotalExercises(prev => prev + 1);
    
    // Track progress
    StorageService.incrementSymbolUsage(currentExercise.correctAnswer.id);
    
    // Continue to next exercise or end session
    setTimeout(() => {
      if (totalExercises >= 9) { // 10 exercises total
        endTherapySession();
      } else {
        generateNextExercise();
      }
    }, 2000);
  };

  const endTherapySession = () => {
    setIsActive(false);
    setShowResults(true);
    setCurrentExercise(null);
    
    // Update progress data
    const currentProgress = getProgressData();
    const newProgress = {
      ...currentProgress,
      totalSessions: currentProgress.totalSessions + 1,
      averageScore: ((currentProgress.averageScore * currentProgress.totalSessions) + (score / totalExercises * 100)) / (currentProgress.totalSessions + 1)
    };
    
    StorageService.saveProgressData(newProgress);
    loadProgressData();
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMotivationalMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Excellent work! You're making great progress! 🌟";
    if (percentage >= 70) return "Good job! Keep practicing and you'll improve even more! 👏";
    if (percentage >= 50) return "Nice effort! Practice makes perfect! 💪";
    return "Great attempt! Every practice session helps you improve! 🌱";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header 
          title="Speech Therapy"
          subtitle="Practice exercises to improve communication skills"
          showEmergency={false}
        />
        
        <Navigation />

        {!isActive && !showResults && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Progress Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span role="img" aria-label="Progress">📊</span>
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressData && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {progressData.totalSessions}
                        </div>
                        <div className="text-sm text-gray-600">Total Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(progressData.averageScore)}%
                        </div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-2">Weekly Usage</h3>
                      <div className="flex space-x-1 h-8">
                        {progressData.weeklyUsage.map((usage, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-gray-200 rounded"
                            style={{
                              backgroundColor: usage > 0 ? '#3B82F6' : '#E5E7EB',
                              opacity: usage / Math.max(...progressData.weeklyUsage, 1)
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Start Therapy Session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span role="img" aria-label="Start">🚀</span>
                  <span>Start Practice</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exercise Type:</label>
                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value as any)}
                    className="w-full p-2 border rounded-lg text-sm"
                  >
                    <option value="symbol_recognition">Symbol Recognition</option>
                    <option value="category_matching">Category Matching</option>
                    <option value="sentence_building">Sentence Building</option>
                  </select>
                </div>
                
                <Button 
                  onClick={startTherapySession}
                  className="w-full bg-green-600 hover:bg-green-700 py-3"
                >
                  Start Practice Session
                  <br />
                  <span className="text-xs opacity-90">(10 exercises)</span>
                </Button>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Symbol Recognition:</strong> Identify symbols by name</p>
                  <p><strong>Category Matching:</strong> Match symbols to categories</p>
                  <p><strong>Sentence Building:</strong> Complete simple sentences</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Exercise */}
        {isActive && currentExercise && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Exercise {totalExercises + 1} of 10
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">
                    Score: {score}/{totalExercises}
                  </Badge>
                  <Progress 
                    value={((totalExercises) / 10) * 100} 
                    className="w-32" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentExercise.question}
                </h2>
                
                {currentExercise.completed && (
                  <div className={`text-lg font-medium mb-4 ${
                    currentExercise.correct ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentExercise.correct ? '✅ Correct!' : '❌ Try again next time'}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {currentExercise.options.map((symbol) => (
                  <div key={symbol.id} className="cursor-pointer">
                    <SymbolCard
                      symbol={symbol}
                      size="medium"
                      onSelect={currentExercise.completed ? undefined : handleAnswer}
                      disabled={currentExercise.completed}
                      isSelected={currentExercise.completed && symbol.id === currentExercise.correctAnswer.id}
                      showText={true}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                🎉 Practice Session Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2">
                <div className={`text-4xl font-bold ${getScoreColor(score, totalExercises)}`}>
                  {score}/{totalExercises}
                </div>
                <div className="text-lg text-gray-600">
                  {Math.round((score / totalExercises) * 100)}% Correct
                </div>
                <div className="text-blue-600 font-medium">
                  {getMotivationalMessage(score, totalExercises)}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <Button 
                  onClick={() => {
                    setShowResults(false);
                    startTherapySession();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Practice Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowResults(false)}
                >
                  Return to Overview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}