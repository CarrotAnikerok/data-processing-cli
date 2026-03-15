import { createReadStream } from 'node:fs';
import { finished } from 'node:stream/promises';

// doesnt count whitespace char as chars 
export async function count(pathResolver, {input}) {
    if (!input) {
        console.log('Operation failed');
        return;
    }

    const reader = createReadStream(pathResolver.resolveRelative(input));

    let lines = 0;
    let words = 0;
    let chars = 0;
    let isData = false;
    let previousChunkString = ''

    reader.on('data', (chunk) => {
        if (!isData) {
            words += 1;
            lines += 1;
            isData = true;
        }
        const string = chunk.toString();

        // case when chunk ends on whitespace char and new chunk starts with non whitespace char
        if (/\s/.test(previousChunkString.slice(-1)) &&  /\S/.test(string.slice(1))) {
            words +=1;
        }
        lines += (string.match(/\r\n|\r|\n/g) || []).length;
        words += (string.match(/\s\S+/g) || []).length;
        chars += string.replaceAll('\n', '').replaceAll('\r', '').length;
        previousChunkString = string;
    });

    reader.on('close', () => {
        console.log(`Lines: ${lines}`);
        console.log(`Words: ${words}`);
        console.log(`Characters: ${chars}`);
        console.log(pathResolver.currentDir);
    })

    await finished(reader);
}