import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  try {
    if (file) {
      // Handle single file request
      const filePath = path.join(process.cwd(), 'data', file);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(fileContents);
      return NextResponse.json(Array.isArray(jsonData) ? jsonData : [jsonData]);
    } else {
      // List all JSON files
      const dataDir = path.join(process.cwd(), 'data');
      const files = await fs.readdir(dataDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      return NextResponse.json(jsonFiles);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let allAbilities: any[] = [];
    
    // Load and combine all JSON files
    for (const file of jsonFiles) {
      const filePath = path.join(dataDir, file);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const jsonData = JSON.parse(fileContents);
      
      if (Array.isArray(jsonData)) {
        allAbilities = [...allAbilities, ...jsonData];
      } else {
        allAbilities.push(jsonData);
      }
    }
    
    return NextResponse.json(allAbilities);
  } catch (error) {
    console.error('Error loading all abilities:', error);
    return NextResponse.json(
      { error: 'Failed to load abilities' },
      { status: 500 }
    );
  }
}
