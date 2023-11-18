import * as fs from 'fs';


// Function to parse the contents of the .env file
function parseEnvFile(envPath: string): Record<string, string> {
    try {
        // need the absolute path to the .env file
        const absolutePath = fs.realpathSync(envPath);
        const envFileContent = fs.readFileSync(absolutePath, 'utf-8');
        const lines = envFileContent.split('\n');
        const envVariables: Record<string, string> = {};

        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                envVariables[key.trim()] = value.trim();
            }
        });

        return envVariables;
    } catch (error) {
        console.error('Error parsing .env file:', error);
        return {};
    }
}

export function loadEnv(path = './.env') {
    const envVariables = parseEnvFile(path);
    // Set environment variables
    Object.keys(envVariables).forEach(key => {
        process.env[key] = envVariables[key];
    });
}
