import fs from 'fs';
import path from 'path';

const folderLocation = '../data/vfs';
const vfsStorageLocation = path.resolve(__dirname, folderLocation);
const vfsStorageFile = path.join(vfsStorageLocation, 'vfs.json');


function createVfs() {
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
    return createVfs();
}

function writeVfs(vfs: JSON) {
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
