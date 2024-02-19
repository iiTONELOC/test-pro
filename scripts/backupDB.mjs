import { exec } from 'child_process';

/**
 * Dumps the production database to the data folder
 */
function backupDB() {
    const command = 'mongodump -d test-pro-production -o ./data';
    const child = exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`There was an error backing up the database: ${error}`);
            process.exit(1); // Exit with a non-zero status code to indicate an error
        }
        if (stdout) console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);

        process.exit(0); // Exit with a status code of 0 upon successful completion
    });

    // Listen for the 'exit' event to handle the case where the process terminates unexpectedly
    child.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
        process.exit(code); // Exit with the same exit code as the child process
    })
}

function main () {
    backupDB();
}

main();
