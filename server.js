const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();

app.use( serve( path.resolve(__dirname, 'dist'), { extensions: ['html'] } ));

app.listen(9527);

console.log('Server is running at port: 9527...');