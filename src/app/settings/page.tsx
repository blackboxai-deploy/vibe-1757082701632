'use client';

import React, { useState, useEffect } from 'react';
import { UserPreferences } from '@/types';
import { getUserPreferences, saveUserPreferences } from '@/lib/storage';
import { speechService } from '@/lib/speech';
import { symbolCategories } from '@/lib/symbols';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testText] = useState("Hello, this is a test of the speech settings.");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const userPrefs = getUserPreferences();
    setPreferences(userPrefs);
    
    // Load available voices
    const voices = speechService.getAvailableVoices();
    setAvailableVoices(voices);
  }, []);

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    if (!preferences) return;
    
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
  };

  const handleVoiceSettingChange = (key: keyof UserPreferences['voiceSettings'], value: any) => {
    if (!preferences) return;
    
    const updated = {
      ...preferences,
      voiceSettings: {
        ...preferences.voiceSettings,
        [key]: value
      }
    };
    setPreferences(updated);
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (!preferences) return;
    
    const categories = checked 
      ? [...preferences.categories, categoryId]
      : preferences.categories.filter(id => id !== categoryId);
    
    handlePreferenceChange('categories', categories);
  };

  const testSpeech = async () => {
    if (!preferences) return;
    
    try {
      await speechService.speak(testText, preferences.voiceSettings);
    } catch (error) {
      console.error('Error testing speech:', error);
    }
  };

  const saveSettings = async () => {
    if (!preferences) return;
    
    setIsSaving(true);
    try {
      saveUserPreferences(preferences);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    const defaultPrefs: UserPreferences = {
      voiceSettings: {
        rate: 1,
        pitch: 1,
        volume: 1,
        voice: undefined
      },
      complexityLevel: 'basic',
      fontSize: 'medium',
      highContrast: false,
      categories: ['basic-needs', 'emotions', 'actions', 'people', 'places']
    };
    setPreferences(defaultPrefs);
  };

  if (!preferences) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Header 
          title="Settings"
          subtitle="Customize your communication experience"
          showEmergency={false}
        />
        
        <Navigation />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Voice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span role="img" aria-label="Voice">🔊</span>
                <span>Voice Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Voice Selection */}
              <div className="space-y-2">
                <Label>Voice</Label>
                <Select
                  value={preferences.voiceSettings.voice || ''}
                  onValueChange={(value) => handleVoiceSettingChange('voice', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Speech Rate */}
              <div className="space-y-2">
                <Label>Speech Rate: {preferences.voiceSettings.rate}</Label>
                <Slider
                  value={[preferences.voiceSettings.rate]}
                  onValueChange={(value) => handleVoiceSettingChange('rate', value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Speech Pitch */}
              <div className="space-y-2">
                <Label>Speech Pitch: {preferences.voiceSettings.pitch}</Label>
                <Slider
                  value={[preferences.voiceSettings.pitch]}
                  onValueChange={(value) => handleVoiceSettingChange('pitch', value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <Label>Volume: {Math.round(preferences.voiceSettings.volume * 100)}%</Label>
                <Slider
                  value={[preferences.voiceSettings.volume]}
                  onValueChange={(value) => handleVoiceSettingChange('volume', value[0])}
                  min={0.1}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Test Speech */}
              <Button onClick={testSpeech} className="w-full">
                🎵 Test Speech
              </Button>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span role="img" aria-label="Display">👁️</span>
                <span>Display Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Complexity Level */}
              <div className="space-y-2">
                <Label>Complexity Level</Label>
                <Select
                  value={preferences.complexityLevel}
                  onValueChange={(value) => handlePreferenceChange('complexityLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic - Simple words and phrases</SelectItem>
                    <SelectItem value="intermediate">Intermediate - More vocabulary</SelectItem>
                    <SelectItem value="advanced">Advanced - Full vocabulary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={preferences.fontSize}
                  onValueChange={(value) => handlePreferenceChange('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
                <Switch
                  id="high-contrast"
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => handlePreferenceChange('highContrast', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Symbol Categories */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span role="img" aria-label="Categories">📂</span>
                <span>Symbol Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {symbolCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={category.id}
                      checked={preferences.categories.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryToggle(category.id, !!checked)}
                    />
                    <Label htmlFor={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <span role="img" aria-label={category.name}>{category.icon}</span>
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">
                        ({category.symbols.length} symbols)
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
                <Button variant="outline" onClick={resetToDefaults}>
                  Reset to Defaults
                </Button>
              </div>
              
              {saveMessage && (
                <div className={`text-sm font-medium ${
                  saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}