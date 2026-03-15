import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';

class csvToJsonTransfrom extends Transform {
    chunkLeftOver = '';
    isHeader = true;
    isFirstLine = true;
    headers = [];
    columnProcessed = 0;

    constructor() {
        super({
            objectMode: true,
            writableObjectMode: true,
            writableObjectMode: false
        });
    }

    _transform(chunk, _, callback) {
        if (!chunk.toString().trim()) return callback();
        const stringChunk = this.chunkLeftOver + chunk.toString();
        let rows;

        if (stringChunk.includes('\r\n')) {
            rows = stringChunk.split('\r\n');
        } else {
            rows = stringChunk.split('\n');
        }

        this.chunkLeftOver = rows.pop();

        if (this.isFirstLine) {
            this.push('[\n  ')
            this.isFirstLine = false;
        } 

        for (let row of rows) {
            const columns = row.split(',');

            if (!columns) {
                continue;
            }

            if (this.isHeader) {
                this.headers = columns;
                if (stringChunk.includes('\n')) {
                    this.isHeader = false;
                }
            } else {
                const record = {};
                this.headers.forEach((h, i) => record[h] = columns[i]);
                this.push(JSON.stringify(record));
                this.push(',\n  ');
            }
        }

        callback();
    }

    _flush(callback) {
        if (!this.chunkLeftOver.trim()) {
            this.push('\n]\n');
            return callback();
        }
        const columns = this.chunkLeftOver.split(',');
        const record = {};
        this.headers.forEach((h, i) => record[h] = columns[i]);
        this.push(JSON.stringify(record));

        this.push('\n]\n');
        callback();

    }
}

export async function csvToJson(pathResolver, {input, output}) {
    if (!input || !output) {
        console.log('You should add --input and --output for csvToJson command');
        return;
    }

    try {
        var readStream = createReadStream(pathResolver.resolveRelative(input));
        var writeStream = createWriteStream(pathResolver.resolveRelative(output));
    } catch {
        console.log('Operation failed');
        return;
    }

    await pipeline(readStream, new csvToJsonTransfrom(), writeStream);
    console.log(pathResolver.currentDir);
}