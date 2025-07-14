import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Blog } from '../types/types';

const DATA_FILE = join(__dirname, '../../blog.json');

export function readBlogs(): Blog[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const data = readFileSync(DATA_FILE, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to read or parse blog.json:', err);
    return [];
  }
}

export function writeBlogs(blogs: Blog[]) {
  writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 12);
}
