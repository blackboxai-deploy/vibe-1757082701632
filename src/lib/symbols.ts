import { Category, Symbol } from '@/types';

export const symbolCategories: Category[] = [
  {
    id: 'basic-needs',
    name: 'Basic Needs',
    color: 'bg-blue-100 border-blue-300',
    icon: '🏠',
    symbols: [
      {
        id: 'water',
        text: 'Water',
        category: 'basic-needs',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1b3a93f6-85bd-4e91-8451-b2b289ef39c4.png',
        complexity: 'basic'
      },
      {
        id: 'food',
        text: 'Food',
        category: 'basic-needs',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/129ef33b-c9b9-46a7-aa1d-bd0d020f4cc2.png',
        complexity: 'basic'
      },
      {
        id: 'bathroom',
        text: 'Bathroom',
        category: 'basic-needs',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2205585c-371e-492e-becb-80cc0109044a.png',
        complexity: 'basic'
      },
      {
        id: 'sleep',
        text: 'Sleep',
        category: 'basic-needs',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/de9ca120-2c87-47b8-9945-96be5218b8ef.png',
        complexity: 'basic'
      },
      {
        id: 'medicine',
        text: 'Medicine',
        category: 'basic-needs',
        imageUrl: 'https://placehold.co/150x150?text=Medicine+pills+bottle+healthcare',
        complexity: 'intermediate'
      },
      {
        id: 'help',
        text: 'Help',
        category: 'basic-needs',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a01d8293-1979-45a1-805c-8ba87d59c00d.png',
        complexity: 'basic'
      }
    ]
  },
  {
    id: 'emotions',
    name: 'Emotions',
    color: 'bg-green-100 border-green-300',
    icon: '😊',
    symbols: [
      {
        id: 'happy',
        text: 'Happy',
        category: 'emotions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dd5c5260-0b79-45a1-b53f-463175f9b69a.png',
        complexity: 'basic'
      },
      {
        id: 'sad',
        text: 'Sad',
        category: 'emotions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b979d868-ec52-4c1e-bdd7-fadcb8719ce6.png',
        complexity: 'basic'
      },
      {
        id: 'angry',
        text: 'Angry',
        category: 'emotions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b727ca3a-681b-4312-b6d2-dd3b6fb9d75b.png',
        complexity: 'basic'
      },
      {
        id: 'scared',
        text: 'Scared',
        category: 'emotions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d736788c-86c0-4413-b0cc-0279b7ffed31.png',
        complexity: 'basic'
      },
      {
        id: 'excited',
        text: 'Excited',
        category: 'emotions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/027835cd-72b7-4cbc-8035-e571b902d10d.png',
        complexity: 'intermediate'
      },
      {
        id: 'confused',
        text: 'Confused',
        category: 'emotions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f7bdd441-6bbc-404d-a7e2-e11061fd75c7.png',
        complexity: 'intermediate'
      }
    ]
  },
  {
    id: 'actions',
    name: 'Actions',
    color: 'bg-orange-100 border-orange-300',
    icon: '🏃',
    symbols: [
      {
        id: 'eat',
        text: 'Eat',
        category: 'actions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/80127f83-41f6-4713-b77a-d81c93ab9e4b.png',
        complexity: 'basic'
      },
      {
        id: 'drink',
        text: 'Drink',
        category: 'actions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/324829fe-222a-476e-b208-b846145718d7.png',
        complexity: 'basic'
      },
      {
        id: 'walk',
        text: 'Walk',
        category: 'actions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bedc0958-76da-4c94-a6c1-724dc6b594b8.png',
        complexity: 'basic'
      },
      {
        id: 'sit',
        text: 'Sit',
        category: 'actions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/423b4c8d-c2fc-4d32-bb78-e1823c3b84c2.png',
        complexity: 'basic'
      },
      {
        id: 'read',
        text: 'Read',
        category: 'actions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9d289804-e6b4-4ce5-81e3-3a3bd5118f2e.png',
        complexity: 'intermediate'
      },
      {
        id: 'write',
        text: 'Write',
        category: 'actions',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d7118d9d-a64e-4427-8ddf-5ad9974114db.png',
        complexity: 'intermediate'
      }
    ]
  },
  {
    id: 'people',
    name: 'People',
    color: 'bg-purple-100 border-purple-300',
    icon: '👥',
    symbols: [
      {
        id: 'family',
        text: 'Family',
        category: 'people',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e6ad5301-604b-4cc1-a1a0-a34ac9b14c19.png',
        complexity: 'basic'
      },
      {
        id: 'doctor',
        text: 'Doctor',
        category: 'people',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5d7ebce9-f68e-48ac-8757-ba8542e55765.png',
        complexity: 'basic'
      },
      {
        id: 'friend',
        text: 'Friend',
        category: 'people',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5a680ee3-9316-4752-90a8-1112cb209a15.png',
        complexity: 'basic'
      },
      {
        id: 'nurse',
        text: 'Nurse',
        category: 'people',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f2ba287d-697f-4fd1-b0ba-7a205f2cf774.png',
        complexity: 'intermediate'
      },
      {
        id: 'therapist',
        text: 'Therapist',
        category: 'people',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bb40b257-0b40-445e-ab50-cf527775021b.png',
        complexity: 'intermediate'
      },
      {
        id: 'caregiver',
        text: 'Caregiver',
        category: 'people',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8780bcd4-e338-4002-9e05-565a385d1cb8.png',
        complexity: 'advanced'
      }
    ]
  },
  {
    id: 'places',
    name: 'Places',
    color: 'bg-teal-100 border-teal-300',
    icon: '🏥',
    symbols: [
      {
        id: 'home',
        text: 'Home',
        category: 'places',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f6a1608d-3746-45d3-87cb-c33c84893fae.png',
        complexity: 'basic'
      },
      {
        id: 'hospital',
        text: 'Hospital',
        category: 'places',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5f258fda-a9d3-4c31-80ff-1c174964da7f.png',
        complexity: 'basic'
      },
      {
        id: 'park',
        text: 'Park',
        category: 'places',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2086bc11-c455-4185-af77-0b12b75acfd7.png',
        complexity: 'basic'
      },
      {
        id: 'store',
        text: 'Store',
        category: 'places',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3af1729b-48c7-4c9d-95d8-7c094f074e3c.png',
        complexity: 'intermediate'
      },
      {
        id: 'therapy-center',
        text: 'Therapy Center',
        category: 'places',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/82a63c18-5742-4e0c-918f-a1983dbab3c4.png',
        complexity: 'advanced'
      },
      {
        id: 'restaurant',
        text: 'Restaurant',
        category: 'places',
        imageUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a6728c63-244d-4e5b-b017-e2688adb8554.png',
        complexity: 'intermediate'
      }
    ]
  }
];

export const getSymbolsByCategory = (categoryId: string): Symbol[] => {
  const category = symbolCategories.find(cat => cat.id === categoryId);
  return category ? category.symbols : [];
};

export const getSymbolsByComplexity = (complexity: 'basic' | 'intermediate' | 'advanced'): Symbol[] => {
  const symbols: Symbol[] = [];
  for (const category of symbolCategories) {
    symbols.push(...category.symbols.filter(symbol => symbol.complexity === complexity));
  }
  return symbols;
};

export const getAllSymbols = (): Symbol[] => {
  const symbols: Symbol[] = [];
  for (const category of symbolCategories) {
    symbols.push(...category.symbols);
  }
  return symbols;
};