import { createServer } from "./server";
import { env } from "./config/env";

async function bootstrap() {
  const app = createServer();
  const port = env.port;

  app.listen(port, () => {
    console.log(`🚀 ${env.appName} v${env.appVersion}`);
    console.log(`🌎 Environment: ${env.nodeEnv}`);
    console.log(`📡 Running on port ${port}`);
  });
}

bootstrap();