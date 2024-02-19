import path from 'path';
import { exit } from 'process';
import { promises as fs } from 'fs';
import { dbConnection, dbClose } from '../packages/server/lib/db/connection.js';
import QuizController from '../packages/server/lib/controllers/dbControllers/quizController.js';

const virtualFileName = 'vfs.json';
const backupFolder = './data/backup';
const userProductionFileSystemDataFolder = './packages/server/data/vfs-production';


// reads the virtual file system and returns the data
async function getVirtualFileSystemData() {
    try {
        const virtualFileSystemData = await fs.readFile(
            path.normalize(`${userProductionFileSystemDataFolder}/${virtualFileName}`), 'utf-8');
        return JSON.parse(virtualFileSystemData);
    } catch (error) {
        console.error('There was an error getting the virtual file system data', error);
        return null;
    }
}

// removes the old backup folder
async function cleanUpOldBackupFolder() {
    const backupOldFolder = `${backupFolder}.old`;
    const backupOldFolderExists = await fs.access(backupOldFolder).then(() => true).catch(() => false);
    if (backupOldFolderExists) {
        await fs.rm(backupOldFolder, { recursive: true });
    }
}

// creates the backup folder if it doesn't exist, returns the backup folder path
async function getOrCreateBackupFolder() {
    try {
        const backupFolderExists = await fs.access(backupFolder).then(() => true).catch(() => false);
        if (!backupFolderExists) {
            await fs.mkdir(backupFolder);
            return backupFolder;
        } else {
            return await cleanUpOldBackupFolder().then(async () => {
                 const backupOldFolder = `${backupFolder}.old`;
                // rename the existing backup folder to backup.old
                return await fs.rename(backupFolder, backupOldFolder).then(async()=> {
                    await fs.mkdir(backupFolder);
                    // return the backup folder path
                    return backupFolder;
                });
            });
        }

    } catch (error) {
        console.error('There was an error creating the backup folder', error);
        return null;
    }
}

// checks if the folder exists and creates it if it doesn't
async function checkIfFolderExistsAndCreateIfNot(folderPath) {
    try {
        const folderExists = await fs.access(folderPath).then(() => true).catch(() => false);
        if (!folderExists) {
            await fs.mkdir(folderPath);
        }
    } catch (error) {
        console.error('There was an error creating the folder', error);
    }
}

// writes the quiz data to a JSON file at the specified folder path
async function writeQuizToJSON(quizData, folderPath) {
     await fs.writeFile(folderPath, JSON.stringify(quizData, null, 2));
}

// creates the file and writes the quiz data to it, if the file already exists,
// it checks the updatedAt date and updates the file if the new data is more recent
async function handleFileCreation(fileData, existingBackupFolder, name, currentPath = 'root') { 
      const quizFilePath = path.normalize(`${currentPath === 'root' ? existingBackupFolder : currentPath}/${name}.json`);
    try {
        const fileExists = await fs.access(quizFilePath).then(() => true).catch(() => false);
        if (fileExists) {
            const { mtime } = await fs.stat(quizFilePath);
            const lastModified = new Date(mtime);
            const updatedAt = new Date(fileData.updatedAt);
            if (updatedAt > lastModified) {
                await writeQuizToJSON(fileData, quizFilePath);
            }
        } else {
            await writeQuizToJSON(fileData, quizFilePath);
        }
    } catch (error) {
        console.error('There was an error creating the file', error);
    }
}

// walks the virtual file system and creates a backup of the quiz data in JSON format
async function walkFileSystemAndCreateJSON(virtualFileSystem, backupFolder, currentPath = 'root') {
    for (const entry of virtualFileSystem) {
        const { name,  children, entryId } = entry;
        if (children && children.length > 0) {
            const folderPath = path.normalize(`${currentPath==='root'? backupFolder:currentPath}/${name}`);
            await checkIfFolderExistsAndCreateIfNot(folderPath);
            await walkFileSystemAndCreateJSON(children, currentPath==='root'? folderPath: `${currentPath}/${name}`);
        } else {
            try {
                const quizData = await QuizController.getById(entryId);
                await handleFileCreation(quizData, backupFolder,name, currentPath);
            } catch (error) {
                console.error(`There was an error getting the file data for ${name} - ${entryId}`, error);
            }
        }
    }
    return virtualFileSystem;
}

// walks the virtual file system and creates a backup of the quiz data in JSON format
// removes the old backup folder that is created when the backup folder already exists
async function backupQuizData(virtualFileSystem, existingBackupFolder) { 
    return await walkFileSystemAndCreateJSON(virtualFileSystem, existingBackupFolder)
        .then(async () => await cleanUpOldBackupFolder())
        .catch(async error => {
            console.error('There was an error backing up the quiz data', error);
            // rename the backup.old back to backup
            await fs.access(`${backupFolder}.old`).then(async () => true).catch(async () => false) &&
                await fs.rename(`${backupFolder}.old`, backupFolder);
        });
}

async function main() {
    let closed = false;
    process.env.NODE_ENV = 'production';
    process.env.DB_NAME = 'test-pro-production';

    await dbConnection().then(async () => {
        console.log('Database connection successful');
        closed = false;
         const existingBackupFolder = await getOrCreateBackupFolder();
        const {virtualFileSystem} = await getVirtualFileSystemData();
        virtualFileSystem && await backupQuizData(virtualFileSystem, existingBackupFolder);
        if (!closed) {
            await dbClose();
            closed = true;
            console.log('Database connection closed.\nBackup completed successfully!');
            exit(0);
        }
    }).catch(async error => {
        console.error('There was an error connecting to the database', error);
        await dbClose();
        closed = true;
        exit(1);
    });
}

main();

