import path from 'path';
import {exec} from 'child_process';
import {loadEnv} from './loadEnv';
import {startServer} from './server';
import {dbConnection, dbClose} from './db/connection';

loadEnv();

(async () => {
  await dbConnection()
    .then(async () => {
      console.log('Connected to database');
      console.log('Starting server');
      await startServer();
      return process.on('SIGINT', async () => {
        await dbClose();
        // call the backup script to ensure the database stays up to date
        const command = 'npm run backupDb';
        return exec(command, {cwd: path.join(process.cwd(), '../../')}, (err, stdout, stderr) => {
          console.log('Backing up database before shutting down server...');
          if (err) {
            console.error(err);
            return;
          }

          if (stdout) {
            console.log(stdout);
          }

          if (stderr) {
            console.error(stderr);
          }

          console.log('Database backed up successfully');
          process.exit(0);
        });
      });
    })
    .catch(async (error: any) => {
      await dbClose();
      process.exit(1);
    });
})();
