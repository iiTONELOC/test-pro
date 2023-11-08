const defaultEnv = [
    "DB_NAME = '<dbname>'",
    "TEST_DB_NAME = '<test-db>'",
    "DB_URI = '<MONGO_DB_URI>'"
];

const envPath = './.env';

// look for .env file
const envFile = Bun.file(envPath);
const envFileExists = await envFile.exists();

// if it doesn't exist, create it
if (!envFileExists) {
    try {
        await Bun.write(envPath, defaultEnv.join('\n'));
        console.log('.env file successfully created');
    } catch (error) {
        console.error('There was an error creating the .env file', error);
    }
} else {
    try {
        // if it does exist, read it and see if the default variables are there
        // if they are there do nothing
        const envFileText = await envFile.text();
        const envFileLines = envFileText.split('\n');

        // check and see if the default env variables are there
        const defaultEnvVariables = defaultEnv.map(env => env.split('=')[0].trim());
        const envFileVariables = envFileLines.map(env => env.split('=')[0].trim());

        // if there are any default variables that are not in the env file, add them
        const missingVariables = defaultEnvVariables.filter(env => !envFileVariables.includes(env));

        if (missingVariables.length > 0) {
            const newEnvFileText = [...envFileLines, ...missingVariables].join('\n');
            await Bun.write(envPath, newEnvFileText);
            console.log('Updated .env file successfully');
        } else {
            console.log('Existing .env file is up to date - no changes made');
        }
    } catch (error) {
        console.error('There was an error updating the .env file', error);
    }
}
