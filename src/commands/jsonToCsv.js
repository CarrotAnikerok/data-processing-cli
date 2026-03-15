import Stream, { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

class jsonToCsvTransfrom extends Transform {
    isFirstLine = true;

    constructor(headers) {
        super({
            objectMode: true,
            writableObjectMode: false,
            readableObjectMode: true
        });
        this.headers = headers
    }

    _transform(chunk, _, callback) {
        if(this.isFirstLine) {
            this.push(`${this.headers.join(',')}\n`);
            this.isFirstLine = false;
        }

        if (!chunk.toString().trim()) return callback();

        const stringRecord = this.headers.map(header => chunk[header]);
        this.push(`${stringRecord.join(',')}\n`)
        callback();
    }
}

//Int hints task says that we need to buffer json before writing it
export async function jsonToCsv(pathResolver, {input, output}) {
    if (!input || !output) {
        console.log('You should add --input and --output for jsonToCsv command');
        return;
    }

    try {
        const inputJson = await readFile(pathResolver.resolveRelative(input));
        var parsedJson = JSON.parse(inputJson);
    } catch {
        console.log('Operation failed');
        return;
    }  

    if (!Array.isArray(parsedJson) || !parsedJson.length) {
        console.log('Operation failed');
        return;
    }

    const readStream = Stream.Readable.from(parsedJson);
    const writeStream = createWriteStream(pathResolver.resolveRelative(output));

    const headers = Object.keys(parsedJson[0]);
    await pipeline(readStream, new jsonToCsvTransfrom(headers), writeStream);
    console.log(pathResolver.currentDir);
}