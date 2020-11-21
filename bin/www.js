#!/usr/bin/env node

const { program } = require('commander');
const json = require('../package.json');

const Server = require('../Server');
program.version(json.version)
.option('-p --port <port>', '端口号')
.option('-d --dir <dir>', '目录')
.option('-h --host <host>', '主机')
.parse(process.argv);

program.on('--help', () => {
    console.log('');
    console.log('Example call:');
    console.log('  $ custom-help --help');
});

let config = {
    port: program.port,
    host: program.host,
    dir: program.dir
}

let server = new Server(config);
server.start();
