import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';


if (process.env.NEXT_RUNTIME === 'nodejs') {
  import('path')
    .then((path) => {
      const currPath = path.resolve(path.dirname(path.dirname(process.cwd())), '.env');
      dotenvExpand.expand(dotenv.config({ path: currPath, }));
      console.info(`Loaded environment variables from: ${currPath}`);
    });
} else if (process.env.NEXT_RUNTIME === 'edge') {
  dotenvExpand.expand(dotenv.config({ path: '/../../.env', }));
}


