import path from 'path';
import fs from 'fs';

const vfsStorageLocation = path.join(__dirname, '../data/vfs');
const vfsStorageFile = path.join(vfsStorageLocation, 'vfs.json');

function createVfs() {
    // create the vfsStorageLocation if it does not exist
    // create the vfsStorageFile if it does not exist
    // return an empty object
    const locationExists = fs.existsSync(vfsStorageLocation);

    if (!locationExists) {
        fs.mkdirSync(vfsStorageLocation);
    }

    const fileExists = fs.existsSync(vfsStorageFile);

    if (!fileExists) {
        fs.writeFileSync(vfsStorageFile, '{}');
        return {};
    }

    const vfsFile = fs.readFileSync(vfsStorageFile, 'utf-8');
    return JSON.parse(vfsFile);
}

function readVfs() {
    // read the json file from the vfsStorageFile location, if the file does not exist, create it and return an empty object
    return createVfs();
}

function writeVfs(vfs: JSON) {
    // make sure the vfsStorageLocation exists
    // write the vfs object to the vfsStorageFile
    // ensure that the vfs is valid JSON

    try {
        const isValidJson = JSON.stringify(vfs) === JSON.stringify(JSON.parse(JSON.stringify(vfs)));
        if (!isValidJson) throw new Error('Invalid JSON')
    } catch (error) {
        throw new Error('Invalid JSON')
    }

    const currentContents = readVfs();

    const newContents = {
        ...currentContents,
        ...vfs
    };

    fs.writeFileSync(vfsStorageFile, JSON.stringify(newContents));
}

function deleteVfs() {
    // delete the vfsStorageLocation and vfsStorageFile
    fs.unlinkSync(vfsStorageFile);
    fs.rmdirSync(vfsStorageLocation);
}

export {
    readVfs,
    writeVfs,
    deleteVfs
};
