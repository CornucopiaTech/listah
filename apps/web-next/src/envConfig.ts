import { loadEnvConfig } from '@next/env';
import path from 'path';


const projectDir = path.dirname(path.dirname(process.cwd()));
loadEnvConfig(projectDir);

