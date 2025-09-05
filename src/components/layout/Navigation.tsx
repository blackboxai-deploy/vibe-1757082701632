'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    href: '/',
    label: 'Communication Board',
    icon: '💬',
    description: 'Main communication board with symbols'
  },
  {
    href: '/builder',
    label: 'Sentence Builder',
    icon: '🏗️',
    description: 'Build complex sentences step by step'
  },
  {
    href: '/library',
    label: 'Personal Phrases',
    icon: '📚',
    description: 'Your saved phrases and favorites'
  },
  {
    href: '/therapy',
    label: 'Therapy',
    icon: '🎯',
    description: 'Practice exercises and progress tracking'
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'Customize voice, symbols, and preferences'
  }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant={pathname === item.href ? "default" : "outline"}
                className={`
                  w-full h-auto py-3 px-4 flex flex-col items-center space-y-1 text-center
                  ${pathname === item.href 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-2xl mb-1" role="img" aria-label={item.label}>
                  {item.icon}
                </span>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className={`
                    text-xs leading-tight
                    ${pathname === item.href ? 'text-blue-100' : 'text-gray-500'}
                  `}>
                    {item.description}
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}