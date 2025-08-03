"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface Ability {
  ability_category: string;
  ability_name: string;
  ability_type: string;
  description: string;
}

interface AbilitiesContextType {
  abilitiesData: Ability[];
  availableFiles: string[];
  isLoading: boolean;
  error: string | null;
  loadAbilities: (fileName: string) => Promise<void>;
  loadAllAbilities: () => Promise<void>;
}

const AbilitiesContext = createContext<AbilitiesContextType | undefined>(undefined);

export function AbilitiesProvider({ children }: { children: ReactNode }) {
  const [abilitiesData, setAbilitiesData] = useState<Ability[]>([]);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAbilities = async (fileName: string) => {
    if (!fileName) return;
    
    // Ensure the file has a .json extension
    const jsonFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/abilities?file=${encodeURIComponent(jsonFileName)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to load file: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      setAbilitiesData(data);
    } catch (err) {
      console.error('Error loading abilities file:', err);
      setError(`Failed to load JSON file: ${jsonFileName}. ${err instanceof Error ? err.message : ''}`);
      setAbilitiesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load all JSON files from the data directory
  const loadAvailableFiles = async () => {
    try {
      const response = await fetch('/api/abilities');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch available files: ${response.status} ${errorText}`);
      }
      const files = await response.json();
      setAvailableFiles(files);
    } catch (err) {
      console.error('Error loading available files:', err);
      setError('Failed to load available files. Please check the console for details.');
    }
  };

  // Load all abilities from all JSON files
  const loadAllAbilities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/abilities/load-all');
      if (!response.ok) throw new Error('Failed to load abilities');
      const data = await response.json();
      setAbilitiesData(data);
    } catch (err) {
      console.error('Error loading all abilities:', err);
      setError('Failed to load abilities');
      setAbilitiesData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load available files on component mount
  useEffect(() => {
    loadAvailableFiles();
    loadAllAbilities(); // Load all abilities by default
  }, []);

  return (
    <AbilitiesContext.Provider value={{ 
      abilitiesData, 
      availableFiles,
      isLoading, 
      error, 
      loadAbilities,
      loadAllAbilities
    }}>
      {children}
    </AbilitiesContext.Provider>
  );
}

export function useAbilities() {
  const context = useContext(AbilitiesContext);
  if (context === undefined) {
    throw new Error('useAbilities must be used within an AbilitiesProvider');
  }
  return context;
}
