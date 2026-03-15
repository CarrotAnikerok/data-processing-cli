import path from 'node:path';

export class PathResolver {
    currentDir;

    resolveRelative(relativePath) {
        return path.resolve(this.currentDir, relativePath);
    }

    setPath(newPath) {
        process.chdir(newPath);
        this.currentDir = newPath;
    }
}
