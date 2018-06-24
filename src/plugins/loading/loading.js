import './loading.scss';
import logoBase64 from './default_logo_base64';

class Loading {
	constructor(opts = {}) {
		this.queue = [];
		this.now = 0;
		this.total = Infinity;
		const { logo = logoBase64 } = opts;
		const container = this.createContainer();
		this.createLogo(logo, container);
		this.process = this.createProcessBar(container);
		this.appendLoading(container);
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
		const bottomLogo = this.createDom({
			innerHTML: `<img src="${logo}">`
		}, ['loading-bottom']);
		container.appendChild(bottomLogo);
	}
	createProcessBar(container) {
		const bar = this.createDom({}, ['loading-process']);
		container.appendChild(bar);
		return bar;
	}
	appendLoading(container) {
		document.body.insertBefore(container, [...document.body.childNodes][0]);
	}
	add(now = 0, total = 0) {
		this.queue.push([now, total]);
	}
	update() {
		this.now = this.queue.reduce((prev, next) => {
			return prev[0] + next[0];
		}, 0);
		this.total = this.queue.reduce((prev, next) => {
			return prev[1] + next[1];
		}, 0);
		if (this.now === this.total) {
			this.onload && this.onload();
		}
	}
}

export default Loading;