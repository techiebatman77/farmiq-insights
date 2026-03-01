import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { DiseaseResult } from '@/lib/diseaseData';

export interface Field {
  id: number;
  name: string;
  crop: string;
  health: number;
  coords: [number, number][];
  location: string;
  area?: string;
  plantedDate?: string;
}

export interface Observation {
  id: number;
  fieldId: number;
  fieldName: string;
  note: string;
  type: 'observation' | 'issue' | 'harvest' | 'irrigation';
  timestamp: Date;
}

export interface User {
  id: number;
  name: string;
  farm: string;
  avatar?: string;
}

interface AppContextType {
  // User
  currentUser: User;
  users: User[];
  switchUser: (userId: number) => void;
  
  // Fields
  fields: Field[];
  addField: (field: Omit<Field, 'id'>) => void;
  updateField: (id: number, updates: Partial<Field>) => void;
  deleteField: (id: number) => void;
  
  // Observations
  observations: Observation[];
  addObservation: (observation: Omit<Observation, 'id' | 'timestamp'>) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFieldId: number | null;
  setSelectedFieldId: (id: number | null) => void;

  // Disease Detection
  diseaseHistory: DiseaseResult[];
  addDiseaseResult: (result: DiseaseResult) => void;
}

const defaultUsers: User[] = [
  { id: 1, name: 'John Farmer', farm: 'Green Valley Farm' },
  { id: 2, name: 'Maria Santos', farm: 'Sunrise Plantation' },
  { id: 3, name: 'Raj Menon', farm: 'Kerala Spice Gardens' },
];

const defaultFields: Field[] = [
  { 
    id: 1, 
    name: 'Paddy Field - Alappuzha', 
    crop: 'Rice', 
    health: 0.82,
    location: 'Alappuzha',
    area: '2.5 hectares',
    plantedDate: '2024-01-15',
    coords: [[9.4981, 76.3388], [9.5081, 76.3388], [9.5081, 76.3488], [9.4981, 76.3488]]
  },
  { 
    id: 2, 
    name: 'Coconut Grove - Thrissur', 
    crop: 'Coconut', 
    health: 0.91,
    location: 'Thrissur',
    area: '4.0 hectares',
    plantedDate: '2020-06-10',
    coords: [[10.5276, 76.2144], [10.5376, 76.2144], [10.5376, 76.2244], [10.5276, 76.2244]]
  },
  { 
    id: 3, 
    name: 'Rubber Plantation - Kottayam', 
    crop: 'Rubber', 
    health: 0.75,
    location: 'Kottayam',
    area: '6.0 hectares',
    plantedDate: '2018-03-20',
    coords: [[9.5916, 76.5222], [9.6016, 76.5222], [9.6016, 76.5322], [9.5916, 76.5322]]
  },
  { 
    id: 4, 
    name: 'Spice Garden - Idukki', 
    crop: 'Cardamom', 
    health: 0.88,
    location: 'Idukki',
    area: '1.5 hectares',
    plantedDate: '2022-07-05',
    coords: [[9.9189, 77.1025], [9.9289, 77.1025], [9.9289, 77.1125], [9.9189, 77.1125]]
  },
];

const defaultObservations: Observation[] = [
  {
    id: 1,
    fieldId: 1,
    fieldName: 'Paddy Field - Alappuzha',
    note: 'Noticed slight yellowing on northeast corner, possible nutrient deficiency',
    type: 'observation',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    fieldId: 2,
    fieldName: 'Coconut Grove - Thrissur',
    note: 'Completed irrigation cycle, soil moisture at optimal levels',
    type: 'irrigation',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    fieldId: 3,
    fieldName: 'Rubber Plantation - Kottayam',
    note: 'Detected early signs of leaf blight, applied organic fungicide',
    type: 'issue',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers[0]);
  const [users] = useState<User[]>(defaultUsers);
  const [fields, setFields] = useState<Field[]>(defaultFields);
  const [observations, setObservations] = useState<Observation[]>(defaultObservations);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [diseaseHistory, setDiseaseHistory] = useState<DiseaseResult[]>([]);

  const addDiseaseResult = useCallback((result: DiseaseResult) => {
    setDiseaseHistory(prev => [result, ...prev]);
  }, []);

  const switchUser = useCallback((userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  }, [users]);

  const addField = useCallback((field: Omit<Field, 'id'>) => {
    setFields(prev => [...prev, { ...field, id: Math.max(...prev.map(f => f.id)) + 1 }]);
  }, []);

  const updateField = useCallback((id: number, updates: Partial<Field>) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const deleteField = useCallback((id: number) => {
    setFields(prev => prev.filter(f => f.id !== id));
  }, []);

  const addObservation = useCallback((observation: Omit<Observation, 'id' | 'timestamp'>) => {
    setObservations(prev => [
      { ...observation, id: Math.max(...prev.map(o => o.id), 0) + 1, timestamp: new Date() },
      ...prev,
    ]);
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      switchUser,
      fields,
      addField,
      updateField,
      deleteField,
      observations,
      addObservation,
      searchQuery,
      setSearchQuery,
      activeTab,
      setActiveTab,
      selectedFieldId,
      setSelectedFieldId,
      diseaseHistory,
      addDiseaseResult,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
