import os from 'node:os';
import { setRepl } from './repl.js';
import { PathResolver } from './utils/pathResolver.js';

main();

function main() {
    let pathResolver = new PathResolver();
    pathResolver.setPath(os.homedir());
    setRepl(pathResolver);
}