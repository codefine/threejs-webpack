// 资源
import image_part1 from './image/part1.png'; /* eslint-disable-line */
import image_part2 from './image/part2.png'; /* eslint-disable-line */
import image_particle from './image/particle.png'; /* eslint-disable-line */
import image_logo from './image/logo.png'; /* eslint-disable-line */
import audio_env1 from './audio/env_loop/env_1_loop.mp3'; /* eslint-disable-line */
import audio_env2 from './audio/env_loop/env_2_loop.mp3'; /* eslint-disable-line */
import audio_env3 from './audio/env_loop/env_3_loop.mp3'; /* eslint-disable-line */
import audio_note1 from './audio/note/note01.mp3'; /* eslint-disable-line */
import audio_note2 from './audio/note/note02.mp3'; /* eslint-disable-line */
import audio_note3 from './audio/note/note03.mp3'; /* eslint-disable-line */
import audio_note4 from './audio/note/note04.mp3'; /* eslint-disable-line */
import audio_note5 from './audio/note/note05.mp3'; /* eslint-disable-line */
import audio_note6 from './audio/note/note06.mp3'; /* eslint-disable-line */
import audio_note7 from './audio/note/note07.mp3'; /* eslint-disable-line */
import audio_note8 from './audio/note/note08.mp3'; /* eslint-disable-line */
import audio_note9 from './audio/note/note09.mp3'; /* eslint-disable-line */
import audio_note10 from './audio/note/note10.mp3'; /* eslint-disable-line */
import audio_note11 from './audio/note/note11.mp3'; /* eslint-disable-line */
import audio_note12 from './audio/note/note12.mp3'; /* eslint-disable-line */
const IMAGE_GROUP = { image_part1, image_part2, image_particle, image_logo };
const AUDIO_GROUP = {
	env: { audio_env1, audio_env2, audio_env3 },
	note: { audio_note1, audio_note2, audio_note3, audio_note4, audio_note5, audio_note6, audio_note7, audio_note8, audio_note9, audio_note10, audio_note11, audio_note12 }
};

// 工具
import * as THREE from 'three';

class MyWebGL {
	constructor(loadingUI) {
		this.loadingUI = loadingUI;
		this.sources = {
			texture: {},
			audio: {
				env: {},
				note: {}
			}
		};
		this.mouse = new THREE.Vector2();
		this.init();
		this.resize();
		this.animate();
		this.initManager();
		this.loadTexture();
		// this.loadAudio();
		this.mouseControls();
	}

	init() {
		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0x000000, 0.008 );

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.set(0, 0, 100);
		
		const light = new THREE.PointLight( 0xffffff, 1, 100 );
		light.position.set(0, 0, 60);
		scene.add(light);

		scene.add(new THREE.AmbientLight( 0xb1b1b1 ));

		const container = document.querySelector('#webgl');
		const renderer = new THREE.WebGLRenderer({
			canvas: container,
			antialias: true,
			logarithmicDepthBuffer: true
		});
    
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(new THREE.Color(0x000000), 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		this.scene = scene;
		this.camera = camera;
		// this.light = light;
		this.container = container;
		this.renderer = renderer;	
	}

	initManager() {
		const manager = new THREE.LoadingManager();
		manager.onProgress = (url, itemsLoaded, itemsTotal) => {
			console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
			this.loadingUI.update({
				id: 'all',
				process: [itemsLoaded, itemsTotal]
			});
		};
		manager.onLoad = () => {
			// console.log(this.sources);
			this.createPlants();
			this.createParticles(60);
			this.createLogo();
		};
		this.manager = manager;
	}

	loadTexture() {
		const textureLoader = new THREE.TextureLoader(this.manager);
		for (const image of Object.keys(IMAGE_GROUP)) {
			textureLoader.load(IMAGE_GROUP[image], texture => this.sources.texture[image] = texture);
		}
	}

	loadAudio() {
		const listener = new THREE.AudioListener();
		this.camera.add( listener );
		this.listener = listener;
		const audioLoader = new THREE.AudioLoader(this.manager);
		for (const audio of Object.keys(AUDIO_GROUP.env)) {
			audioLoader.load(AUDIO_GROUP.env[audio], buffer => {
				const sound = new THREE.PositionalAudio(listener);
				sound.setBuffer(buffer);
				sound.setRefDistance(20);
				// sound.play();
				this.sources.audio.env[audio] = sound;
			});
		}
		for (const audio of Object.keys(AUDIO_GROUP.note)) {
			audioLoader.load(AUDIO_GROUP.note[audio], buffer => {
				const sound = new THREE.Audio(listener);
				sound.setBuffer( buffer );
				sound.setLoop(true);
				sound.setVolume(0.5);
				// sound.play();
				this.sources.audio.note[audio] = sound;
			});
		}
	}

	createLogo() {
		const geo = new THREE.PlaneBufferGeometry(50, 50);
		const mtl = new THREE.MeshPhongMaterial({
			transparent: true,
			opacity: 0,
			map: this.sources.texture.image_logo
		});
		const logo = new THREE.Mesh(geo, mtl);
		logo.position.set(0, 0, 50);
		this.scene.add(logo);
		this.logo = logo;
	}

	createPlants() {
		this.plantGroup = new THREE.Object3D();
		this.scene.add(this.plantGroup);

		const geo = new THREE.PlaneGeometry(100, 100);
		const mtl = new THREE.MeshPhongMaterial({
			transparent: true,
			map: this.sources.texture.image_part1
		});
		
		_plant.call(this, geo, mtl, 50, 30, -30);
		_plant.call(this, geo, mtl, -30, -10, 0);
		_plant.call(this, geo, mtl, -80, 50, -20);
		_plant.call(this, geo, mtl, -70, 0, 40);
		_plant.call(this, geo, mtl, -10, 50, 30);
		_plant.call(this, geo, mtl, 80, -30, 30);
		_plant.call(this, geo, mtl, 80, 60, 10);
		_plant.call(this, geo, mtl, 20, -40, -40);
		_plant.call(this, geo, mtl, 100, 40, 35);

		_plant.call(this, geo, mtl, -60, 30, 80);
		_plant.call(this, geo, mtl, 50, 20, 60);
		_plant.call(this, geo, mtl, -10, -40, 70);
		_plant.call(this, geo, mtl, -80, -30, 60);
		_plant.call(this, geo, mtl, 70, -50, 80);

		function _plant(geo, mtl, x, y, z) {
			const plant = new THREE.Mesh(geo, mtl);
			plant.position.set(x, y, z);
			plant.userData.direction = [-1, 1][Math.round( Math.random() )];
			this.plantGroup.add(plant);
		}
	}

	createParticles(len) {
		this.particleGroup = new THREE.Object3D();
		this.scene.add(this.particleGroup);
		const geo = new THREE.PlaneBufferGeometry(8, 8);
		const mtl = new THREE.MeshBasicMaterial({
			transparent: true,
			map: this.sources.texture.image_particle
		});
		for (let i = 0; i < len; i++) {
			this.particleGroup.add( _particle(geo, mtl) );
		}
		function _particle(geo, mtl) {
			const particle = new THREE.Mesh(geo, mtl);
			particle.position.set(-120 + Math.random() * 240, -80 + Math.random() * 160, -100 + Math.random() * 200);
			particle.userData.direction = [-1, 1][Math.round( Math.random() )];
			particle.userData.middle = particle.position.y;
			return particle;
		}
	}
  
	animate() {
		window.requestAnimationFrame(() => {
			this.animate();
		});
		this.logoAnimation();
		this.plantsAnimation();
		this.particlesAnimation();
		this.updateCamera();
		this.render();
	}

	logoAnimation() {
		if (this.logo) {
			this.logo.material.opacity += (1 - this.logo.material.opacity) * 0.01;
		}
	}

	plantsAnimation() {
		if (this.plantGroup && this.plantGroup.children.length) {
			for (const plant of this.plantGroup.children) {
				plant.rotation.z += plant.userData.direction * 0.0005;
			}
		}
	}

	particlesAnimation() {
		if (this.particleGroup && this.particleGroup.children.length) {
			for (const particle of this.particleGroup.children) {
				let { middle, direction } = particle.userData;
				particle.position.y = middle + Math.cos( Date.now() * 0.00005 ) * 40 * direction;
			}
		}
	}

	handleMouseMove(event) {
		event.preventDefault();
		const center = {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		};
		let x = event.clientX ? event.clientX : (event.changedTouches ? event.changedTouches[0].clientX : center.x);
		let y = event.clientX ? event.clientY : (event.changedTouches ? event.changedTouches[0].clientY : center.y);
		this.mouse.x = -1 + (x / window.innerWidth) * 2;
		this.mouse.y = 1 - (y / window.innerHeight) * 2;
		// raycaster.setFromCamera(this.mouse, camera);
	}

	updateCamera() {
		this.camera.position.x += ( this.normalize(this.mouse.x, -1, 1, -60, 60) - this.camera.position.x ) * 0.1;
		this.camera.position.z += ( this.normalize(-this.mouse.y, -1, 1, 30, 150) - this.camera.position.z ) * 0.1;
		this.camera.lookAt(new THREE.Vector3(0, 0, -10000));
	}

	mouseControls() {
		this.renderer.domElement.addEventListener('mousemove', (ev) => {
			this.handleMouseMove(ev);
		}, false);
		this.renderer.domElement.addEventListener('touchmove', (ev) => {
			ev.preventDefault();
			this.handleMouseMove(ev);
		}, false);
	}
	
	resize() {
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}, false);
	}
  
	render() {
		this.renderer.render(this.scene, this.camera);
	}

	computedBounding(obj) {
		const box = new THREE.Box3().setFromObject(obj);
		const boundingSphere = box.getBoundingSphere(new THREE.Sphere()); 
		const radius = boundingSphere.radius; 
		const center = boundingSphere.center; 
		const scale = 100 / radius; 
		const bottom = box.min.y; 
		const top = box.max.y; 
		const maxLength = box.max.x - box.min.x; 
		const maxWidth = box.max.z - box.min.z; 
		const maxHeight = box.max.y - box.min.y; 
		const sideX = Math.max( Math.abs(box.max.x), Math.abs(box.min.x) );
		const sideZ = Math.max( Math.abs(box.max.z), Math.abs(box.min.z) );
		return { scale, center, bottom, top, maxLength, maxWidth, maxHeight, sideX, sideZ, radius };
	}

	normalize(v, vmin, vmax, tmin, tmax) {
		const nv = Math.max(Math.min(v, vmax), vmin); //鼠标移出画布后坐标修正
		const dv = vmax - vmin; //坐标轴总长度
		const pc = (nv - vmin) / dv; //坐标百分化
		const dt = tmax - tmin; //取值范围
		const tv = tmin + (pc * dt); //范围内的实际坐标
		return tv;
	}

	/**
  * @description select range
  */
	searchModelFromChild(child) {
		while (child) {
			if (child.userData.interactive) {
				return child;
			}
			child = child.parent;
		}
	}
}

export default MyWebGL;