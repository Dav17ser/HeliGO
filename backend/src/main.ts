import app from "./server";
import { env } from "./config/env";

async function bootstrap() {
  const port = env.port;

  app.listen(port, () => {
    console.log(`🚀 ${env.appName} v${env.appVersion}`);
    console.log(`🌎 Environment: ${env.nodeEnv}`);
    console.log(`📡 Running on port ${port}`);
  });
}

bootstrap();