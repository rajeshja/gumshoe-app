import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let allAbilities: any[] = [];
    
    // Load and combine all JSON files
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(dataDir, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(fileContents);
        
        if (Array.isArray(jsonData)) {
          allAbilities = [...allAbilities, ...jsonData];
        } else {
          allAbilities.push(jsonData);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    return NextResponse.json(allAbilities);
  } catch (error) {
    console.error('Error in load-all API:', error);
    return NextResponse.json(
      { error: 'Failed to load all abilities' },
      { status: 500 }
    );
  }
}
