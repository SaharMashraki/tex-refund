import { buildApp } from './app';
import { env } from './config/env';

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT || 3000, host: '0.0.0.0' });
    console.log(`Server listening on port ${env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
