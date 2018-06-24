import './info.scss';

class Info {
	constructor(opts = {}) {
		const {
			title = 'WebGL Demo',
			author = 'Michael.Lu',
			link = 'https://www.lujingtao.com',
			time = new Date().toLocaleDateString(),
			theme = 'light',
			describtion
		} = opts;
		const container = this.createContainer(theme);
		this.createTitle(title, container);
		describtion && this.createDesctibtion(describtion, container);
		this.createContent(author, link, time, container);
		this.appendInfo(container);
	}
	createDom(attrs = {}, classList, tagName = 'div') {
		const element = document.createElement(tagName);
		classList && element.classList.add(...classList);
		for (const attr of Object.keys(attrs)) {
			attrs[attr] && (element[attr] = attrs[attr]);
		}
		return element;
	}
	createContainer(theme) {
		const container = this.createDom({
			id: 'info'
		}, ['info-container', theme], 'section');
		return container;
	}
	createTitle(title, container) {
		const titleDom = this.createDom({
			innerHTML: title
		}, ['info-title']);
		container.appendChild(titleDom);
	}
	createDesctibtion(describtion, container) {
		const describtionDom = this.createDom({
			innerHTML: describtion
		}, ['info-describtion']);
		container.appendChild(describtionDom);
	}
	createContent(author, link, time, container) {
		const contentDom = this.createDom({
			innerHTML: `Created by <a class="info-link" href="${link}" target="_blank">${author}</a>, ${time}`
		}, ['info-content']);
		container.appendChild(contentDom);
	}
	appendInfo(container) {
		document.body.insertBefore(container, [...document.body.childNodes][0]);
	}
}

export default Info;