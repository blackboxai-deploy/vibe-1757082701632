'use client';

import React from 'react';
import { Category } from '@/types';
import SymbolCard from './SymbolCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CategoryGridProps {
  category: Category;
  onSymbolSelect: (symbol: any) => void;
  selectedSymbols?: string[];
  complexityLevel?: 'basic' | 'intermediate' | 'advanced';
}

export default function CategoryGrid({
  category,
  onSymbolSelect,
  selectedSymbols = [],
  complexityLevel = 'basic'
}: CategoryGridProps) {
  
  // Filter symbols based on complexity level
  const filteredSymbols = category.symbols.filter(symbol => {
    switch (complexityLevel) {
      case 'basic':
        return symbol.complexity === 'basic';
      case 'intermediate':
        return symbol.complexity === 'basic' || symbol.complexity === 'intermediate';
      case 'advanced':
        return true; // Show all symbols
      default:
        return symbol.complexity === 'basic';
    }
  });

  return (
    <Card className="w-full">
      <CardHeader className={`${category.color} rounded-t-lg`}>
        <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
          <span className="text-2xl" role="img" aria-label={category.name}>
            {category.icon}
          </span>
          <span>{category.name}</span>
          <span className="text-sm font-normal text-gray-600">
            ({filteredSymbols.length} symbols)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {filteredSymbols.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredSymbols.map((symbol) => (
              <SymbolCard
                key={symbol.id}
                symbol={symbol}
                size="medium"
                onSelect={onSymbolSelect}
                isSelected={selectedSymbols.includes(symbol.id)}
                showText={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No symbols available at this complexity level.</p>
            <p className="text-sm mt-1">
              Try switching to a higher complexity level in settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}