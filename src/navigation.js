import fs from 'node:fs/promises';

export function up(pathResolver) {
    pathResolver.setPath(pathResolver.resolveRelative('..'));
    console.log(pathResolver.currentDir);
}

export function cd(pathResolver, path) {
    if (!path) {
        console.log('Path argument is required for cd command');
        return;
    }

    try {
        pathResolver.setPath(pathResolver.resolveRelative(path));
    } catch {
        console.log('Operation failed')
    }

    console.log(pathResolver.currentDir);
}

//may be error if not permitted
export async function ls(pathResolver) {
    const currentFiles = await fs.readdir(pathResolver.currentDir);
    let dirs = [];
    let files = []
    let mostLongName = 0;
    for (let file of currentFiles) {
        if (file.length > mostLongName) {
            mostLongName = file.length;
        }


        const fileStats = await fs.stat(file);
        if (fileStats.isDirectory()) {
            dirs.push(file);
            continue;
        }

        files.push(file);
    }

    // is it right sorting?
    dirs.sort();
    files.sort();

    dirs.forEach(dir => {
        console.log(`${dir.padEnd(mostLongName, ' ')} [folder]`);
    })

    files.forEach(file => {
        console.log(`${file.padEnd(mostLongName, ' ')} [file]`);
    })
}