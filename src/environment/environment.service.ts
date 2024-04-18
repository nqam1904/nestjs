import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

@Injectable()
export class DotEnvService {
  constructor() {
    config();
  }
  get(name: string, defaultValue?: any): string {
    return process.env[name] || defaultValue;
  }
}
