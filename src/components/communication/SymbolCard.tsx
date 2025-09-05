'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Symbol } from '@/types';
import { speakSymbol } from '@/lib/speech';
import { StorageService } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SymbolCardProps {
  symbol: Symbol;
  size?: 'small' | 'medium' | 'large';
  onSelect?: (symbol: Symbol) => void;
  isSelected?: boolean;
  showText?: boolean;
  disabled?: boolean;
}

export default function SymbolCard({
  symbol,
  size = 'medium',
  onSelect,
  isSelected = false,
  showText = true,
  disabled = false
}: SymbolCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-40 h-40'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  const handleClick = async () => {
    if (disabled) return;

    setIsLoading(true);
    
    try {
      // Track symbol usage
      StorageService.incrementSymbolUsage(symbol.id);
      
      // Speak the symbol
      await speakSymbol(symbol.text);
      
      // Call onSelect if provided
      if (onSelect) {
        onSelect(symbol);
      }
    } catch (error) {
      console.error('Error handling symbol selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className={`
      transition-all duration-200 cursor-pointer hover:shadow-lg
      ${isSelected ? 'ring-4 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${isLoading ? 'scale-95' : 'hover:scale-105'}
    `}>
      <CardContent className="p-3">
        <Button
          variant="ghost"
          className={`
            w-full h-full flex flex-col items-center justify-center space-y-2 p-2
            ${sizeClasses[size]}
            ${disabled ? 'pointer-events-none' : ''}
          `}
          onClick={handleClick}
          disabled={disabled || isLoading}
        >
          <div className="relative flex-1 w-full flex items-center justify-center">
            {!imageError ? (
              <Image
                src={symbol.imageUrl}
                alt={symbol.text}
                width={120}
                height={120}
                className="object-contain rounded-lg"
                onError={handleImageError}
                priority={size === 'large'}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl" role="img" aria-label={symbol.text}>
                  {symbol.category === 'basic-needs' && '🏠'}
                  {symbol.category === 'emotions' && '😊'}
                  {symbol.category === 'actions' && '🏃'}
                  {symbol.category === 'people' && '👥'}
                  {symbol.category === 'places' && '🏥'}
                </span>
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          
          {showText && (
            <div className={`
              font-medium text-center text-gray-800 mt-2
              ${textSizeClasses[size]}
            `}>
              {symbol.text}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}