// Test file to verify Node.js TypeScript configuration
import { EventEmitter } from 'events';
import * as fs from 'fs/promises';

// Test 1: Node.js built-in modules
async function readFileExample(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, 'utf-8');
  return content;
}

// Test 2: EventEmitter usage
class CustomEmitter extends EventEmitter {
  emitCustomEvent(data: string): void {
    this.emit('custom', data);
  }
}

// Test 3: CommonJS exports (should work with Node config)
module.exports = {
  readFileExample,
  CustomEmitter,
};

// Test 4: Process environment
function getEnvVar(key: string): string | undefined {
  return process.env[key];
}

// Test 5: Buffer
function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64');
}

export { readFileExample, CustomEmitter, getEnvVar, base64Encode };
