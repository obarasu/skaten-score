import { Program } from './types';
import { ProgramSchema } from './rules';

export function programToURL(program: Program): string {
  try {
    const json = JSON.stringify(program);
    const base64 = btoa(encodeURIComponent(json));
    return `?data=${base64}`;
  } catch (error) {
    console.error('Failed to serialize program:', error);
    return '';
  }
}

export function urlToProgram(url: string): Program | null {
  try {
    const params = new URLSearchParams(url);
    const data = params.get('data');
    if (!data) return null;
    
    const json = decodeURIComponent(atob(data));
    const parsed = JSON.parse(json);
    const validated = ProgramSchema.parse(parsed);
    return validated as Program;
  } catch (error) {
    console.error('Failed to deserialize program:', error);
    return null;
  }
}

export function programToJSON(program: Program): string {
  return JSON.stringify(program, null, 2);
}

export function jsonToProgram(json: string): Program | null {
  try {
    const parsed = JSON.parse(json);
    const validated = ProgramSchema.parse(parsed);
    return validated as Program;
  } catch (error) {
    console.error('Failed to parse program JSON:', error);
    return null;
  }
}

export function downloadJSON(program: Program, filename: string = 'skating-program.json') {
  const json = programToJSON(program);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}