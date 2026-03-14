
/**
 * return object like
 * { command: cd, args: 'pathToDirectory'} 
 * or
 * { command: csv-to-json, args: {input: 'data.csv', output: 'data.json'}}
 */

export function argParse(line) {
    if (!line) {
        return {};
    }

    const correctedLine = line.toLowerCase();
    const lineElements = correctedLine.split(' ');
    const command = lineElements[0];
    const commandArgs = lineElements.slice(1);

    if (commandArgs.length === 1 && !commandArgs[0].startsWith('--')) {
        return {command, args: commandArgs[0]};
    }

    let argsObject = {};
    
    for (let i = 0; i < commandArgs.length; i++) {
        if (commandArgs[i].startsWith('--')) {
            const clearArg = commandArgs[i].slice(2);
            if (i+1 >= commandArgs.length || (i+1 < commandArgs.length && commandArgs[i+1].startsWith('--'))) {
                argsObject[clearArg] = true;
            } else {
                argsObject[clearArg] = commandArgs[i+1]
            }
        }
    }

    if (!Object.keys(argsObject).length) {
        return {command, args: ''};
    }

    return {command, args: argsObject};
}

//console.log(argParse('cd path_to_directory'));