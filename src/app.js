// 开发环境html热更新
if (process.env.NODE_ENV === 'development') {
	require('./index.html');
}

import './assets/style/main.scss';
import Info from 'plugin/info/info.js'; /* eslint-disable-line */
import Loading from 'plugin/loading/loading.js'; /* eslint-disable-line */
import Vconsole from 'vconsole'; /* eslint-disable-line */
import Engine from './assets/webgl.js';

// 启用vconsole调试工具
// const vconsole = new Vconsole();

// 说明
// new Info({
// 	title: 'Music Gardan',
// 	// describtion: 'hello',
// 	author: 'Michael.Lu',
// 	link: 'https://www.lujingtao.com',
// 	theme: 'light',
// 	time: new Date().toLocaleDateString() 
// });

const loading = new Loading();

new Engine(loading); /* eslint-disable-line */