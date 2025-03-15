import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'path';
dotenvExpand.expand(
  dotenv.config({
    path: path.resolve(path.dirname(path.dirname(process.cwd())), '.env')
  }
));
