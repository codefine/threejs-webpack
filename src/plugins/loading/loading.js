import './loading.scss';
import logoBase64 from './default_logo_base64';

class Loading {
	constructor(opts = {}) {
		const { logo = logoBase64, onLoad } = opts;
		this.queue = [];
		this.onLoad = onLoad;
		this.container = this.createContainer();
		this.createLogo(logo, this.container);
		this.processBar = this.createProcessBar(this.container);
		this.appendLoading(this.container);
	}
	createDom(attrs = {}, classList, tagName = 'div') {
		const element = document.createElement(tagName);
		classList && element.classList.add(...classList);
		for (const attr of Object.keys(attrs)) {
			attrs[attr] && (element[attr] = attrs[attr]);
		}
		return element;
	}
	createContainer() {
		const container = this.createDom({
			id: 'loading'
		}, ['loading-container']);
		return container;
	}
	createLogo(logo, container) {
		const topLogo = this.createDom({
			innerHTML: `<img src="${logo}">`
		}, ['loading-top']);
		container.appendChild(topLogo);
		this.topLogo = topLogo;
		const bottomLogo = this.createDom({
			innerHTML: `<img src="${logo}">`
		}, ['loading-bottom']);
		container.appendChild(bottomLogo);
		this.bottomLogo = bottomLogo;
	}
	createProcessBar(container) {
		const bar = this.createDom({}, ['loading-process']);
		container.appendChild(bar);
		return bar;
	}
	appendLoading(container) {
		document.body.insertBefore(container, [...document.body.childNodes][0]);
	}
	subscribe(watcher) {
		this.queue.push(watcher);
	}
	update(watcher) {
		const { id, process: [ now ] } = watcher;
		const index = this.queue.findIndex(item => item.id === id);
		if (index >= 0) {
			this.queue[index].process[0] = now;
			this.onProcess();
		} else {
			this.subscribe(watcher);
		}
	}
	onProcess() {
		const now = this.queue.length > 1 ? this.queue.reduce((prev, next) => {
			return prev.process[0] + next.process[0];
		}) : this.queue[0].process[0];
		const total = this.queue.length > 1 ? this.queue.reduce((prev, next) => {
			return prev.process[1] + next.process[1];
		}) : this.queue[0].process[1];
		this.updateProcessBar(now, total);
		if (now === total) {
			this.logoFinishAction();
			this.onLoad && this.onLoad();
			this.onLoad = null;
			this.onProcess = () => {}; // eslint-disable-line
		}
	}
	updateProcessBar(now, total) {
		now < 0 && (now = 0);
		this.processBar.style.width = Math.ceil(now / total * 100) + '%';
	}
	logoFinishAction() {
		this.container.classList.add('finish');
		setTimeout(() => {
			this.container.classList.add('hide');
			document.body.removeChild(this.container);
		}, 2450);
	}
}

export default Loading;