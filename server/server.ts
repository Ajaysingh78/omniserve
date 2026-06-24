import { configDotenv } from 'dotenv';
configDotenv();

import app from './src/app.js';
import connectToMongoDB from './src/config/db.config.js';
import connectRedis from './src/config/redis.config.js';



import { OutboxPollerService } from './src/services/outbox-poller.service.js';

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
   try {
      await Promise.all([connectToMongoDB(), connectRedis()]);

      // Start outbox poller
      OutboxPollerService.start();

      app.listen(PORT, () => {
         console.log(`app listening on port ${PORT}`);
      });
   }
   catch (error: unknown) {
      if(error instanceof Error) console.error('Server bootstrap failed:', error.message);
      process.exit(1);
   }
};



await bootstrap();  
