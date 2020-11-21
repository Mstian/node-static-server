
const http = require('http');
const fs = require('mz/fs');
const mime = require('mime');
const chalk = require('chalk');
const path = require('path');
const url = require('url');
const ejs = require('ejs');
let template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');
const baseConfig = {
    port: 3000,
    host: '127.0.0.1',
    dir: process.cwd()
}
class Server{
    constructor({port, host, dir}){
        this.port = port || baseConfig.port;
        this.host = host || baseConfig.host;
        this.dir = dir || baseConfig.dir;
        this.template = template;
    }
    start() {
        let server = http.createServer(this.sendRequest.bind(this));
        server.listen(this.port, this.host, () => {
            console.log(chalk.yellow(`服务启动, 服务路径是${this.dir}`));
            console.log(chalk.green(`http://${this.host}:${this.port}`));
        })
    }
    async sendRequest(req, res) {
        try{
            let {pathname} = url.parse(req.url);
            let currentPath = path.join(this.dir, pathname);
            let stats = await fs.stat(currentPath);
            if(stats.isDirectory()) {
                let dirs = await fs.readdir(currentPath);
                let datas = dirs.map((item, index) => {
                    return {
                        href: path.join(pathname, item),
                        content: item
                    }
                })
                let str = ejs.render(this.template, {data: datas});
                res.setHeader('Content-type', 'text/html; charset-utf8');
                res.end(str);
            } else {
                this.responseData(req, res, currentPath);
            }
        }catch(e){
            console.log(e);
            this.sendError(req, res);
        }
    }
    responseData(req, res, currentPath) {
        res.setHeader('Content-type', mime.getType(currentPath) +'; charset=utf8');
        fs.createReadStream(currentPath).pipe(res);
    }
    sendError(req, res) {
        res.statusCode = 404;
        res.end('Not Found');       
    }
}

module.exports = Server;