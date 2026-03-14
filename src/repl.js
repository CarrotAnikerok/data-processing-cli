import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { up, cd, ls } from './navigation.js';
import { argParse } from './utils/argParser.js';

export function setRepl(pathResolver) {
    const rl = readline.createInterface({ input, output});
    console.log('Welcome to Data Processing CLI!');
    console.log(`You are currently in ${pathResolver.currentDir}`);
    rl.prompt();

    rl.on('line', async (input) => {
        const { command, args } = argParse(input);
        switch(command) {
            case 'up':
                up(pathResolver);
                break;
            case 'cd':
                cd(pathResolver, args);
                break;
            case 'ls':
                await ls(pathResolver);
                break;
            case '.exit':
                rl.close();
                break;
            default:
                console.log('Invalid input');
        }

        rl.prompt();
    })

    rl.on('close', () => {
        console.log('\nThank you for using Data Processing CLI!');
        process.exit();
    })
}
