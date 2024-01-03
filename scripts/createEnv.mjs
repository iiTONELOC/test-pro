import { promises as fs } from 'fs';

const defaultEnv = [
    'PORT=<3000>',
    'DB_NAME=<test-pro-development>',
    'PROD_DB_NAME=<test-pro-production>',
    'TEST_DB_NAME=<test-pro-test-db>',
    'DB_URI=mongodb://localhost:27017/',
    'OPENAI_MODEL_NAME=<replaceWithDesiredModel_DefaultsToGPT-4>',
    'OPENAI_API_KEY=<replaceWithYourOpenAI_APIKey>'
];

const envPath = './packages/server/.env';

async function checkAndCreateEnvFile() {
    try {
        // Check if .env file exists
        const envFileExists = await fs.access(envPath).then(() => true).catch(() => false);

        // If it doesn't exist, create it
        if (!envFileExists) {
            await fs.writeFile(envPath, defaultEnv.join('\n'));
            console.log('.env file successfully created');
        } else {
            // If it does exist, read it and see if the default variables are there
            const envFileText = await fs.readFile(envPath, 'utf-8');
            const envFileLines = envFileText.split('\n');

            // Check and see if the default env variables are there
            const defaultEnvVariables = defaultEnv.map(env => env.split('=')[0].trim());
            const envFileVariables = envFileLines.map(env => env.split('=')[0].trim());

            // If there are any default variables that are not in the env file, add them
            const missingVariables = defaultEnvVariables.filter(env => !envFileVariables.includes(env));

            if (missingVariables.length > 0) {
                const newEnvFileText = [...envFileLines, ...missingVariables].join('\n');
                await fs.writeFile(envPath, newEnvFileText);
                console.log('Updated .env file successfully');
            } else {
                console.log('Existing .env file is up to date - no changes made');
            }
        }
    } catch (error) {
        console.error('There was an error handling the .env file', error);
    }
}

// Call the function to check and create/update the .env file
checkAndCreateEnvFile();
