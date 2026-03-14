
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