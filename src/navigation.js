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
        console.log('Operation failed');
    }

    console.log(pathResolver.currentDir);
}

//may be error if not permitted
export async function ls(pathResolver) {
    try {
        var currentFiles = await fs.readdir(pathResolver.currentDir);
    } catch {
        console.log('Operation failed');
        return;
    }
    let dirs = [];
    let files = []
    let mostLongName = 0;
    for (let file of currentFiles) {
        if (file.length > mostLongName) {
            mostLongName = file.length;
        }

        try {
            var fileStats = await fs.stat(file);
        } catch {
            continue;
        }
        if (fileStats.isDirectory()) {
            dirs.push(file);
            continue;
        }

        files.push(file);
    }

    const sortFunc = (a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    }

    dirs.sort(sortFunc);
    files.sort(sortFunc);

    dirs.forEach(dir => {
        console.log(`${dir.padEnd(mostLongName, ' ')} [folder]`);
    })

    files.forEach(file => {
        console.log(`${file.padEnd(mostLongName, ' ')} [file]`);
    })

    console.log(pathResolver.currentDir);
}