"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface AbilitiesFileSelectorProps {
  onFileSelect: (fileName: string) => void
}

// This function formats the file name for display
const formatFileName = (fileName: string): string => {
  // Remove .json extension, replace hyphens with spaces, and capitalize each word
  return fileName
    .replace(/\.json$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function AbilitiesFileSelector({ onFileSelect }: AbilitiesFileSelectorProps) {
  const [availableFiles, setAvailableFiles] = useState<{value: string, label: string}[]>([])
  const [selectedFile, setSelectedFile] = useState<string>("")
  const initialRender = useRef(true)

  useEffect(() => {
    const fetchAvailableFiles = async () => {
      try {
        const response = await fetch('/api/abilities');
        if (!response.ok) throw new Error('Failed to fetch files');
        const files = await response.json();
        
        const formattedFiles = files.map((file: string) => ({
          value: file,
          label: formatFileName(file)
        }));
        
        setAvailableFiles(formattedFiles);
        
        // Set the first file as default only on initial render
        if (formattedFiles.length > 0 && initialRender.current) {
          initialRender.current = false;
          setSelectedFile(formattedFiles[0].value);
          onFileSelect(formattedFiles[0].value);
        }
      } catch (error) {
        console.error('Error loading files:', error);
        // Fallback to empty array if API fails
        setAvailableFiles([]);
      }
    };
    
    fetchAvailableFiles();
  }, [onFileSelect])

  const handleSelect = (value: string) => {
    setSelectedFile(value)
    onFileSelect(value)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Abilities File</h3>
      <Select value={selectedFile} onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an abilities file" />
        </SelectTrigger>
        <SelectContent>
          {availableFiles.map((file) => (
            <SelectItem key={file.value} value={file.value}>
              {file.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
