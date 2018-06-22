import * as THREE from 'three';
import 'threejs/controls/OrbitControls';
import music from './music.mp3';
import logo from './logo.jpg';

class MyWebGL {
	constructor() {
		this.init();
		this.resize();
		this.useControls();
		this.animate();
		this.initAudio();
		this.initCubes();
		this.initLogo();
	}

	init() {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.set(1500, 2000, 1500);

		const light = new THREE.SpotLight(0xffffff, 1.2);
		light.distance = 2000;
		light.penumbra = 0.5;
		light.decay = 1;
		light.position.set(0, 800, 0);
		scene.add(light);

		const container = document.querySelector('#webgl');
		const renderer = new THREE.WebGLRenderer({
			canvas: container,
			antialias: true,
			logarithmicDepthBuffer: true
		});
    
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(new THREE.Color(0x1a2c3a), 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		this.scene = scene;
		this.camera = camera;
		this.light = light;
		this.container = container;
		this.renderer = renderer;	
	}
  
	animate() {
		window.requestAnimationFrame(() => {
			this.animate();
		});
		this.controls.enabled && this.controls.update();
		if (this.analyser) { // music start
			const data = this.analyser.getFrequencyData();
			this.light.angle = data[3] / 120;
			for (let i = 0; i < data.length; i ++) {
				const cube = this.cubeBox.getObjectByName(`cube${i}`);
				if (cube) {
					cube && cube.scale.set(1, Math.max(data[i] / 255 * 4, 0.05), 1);
				}
			}
		}
		if (this.logo) {
			this.logo.rotation.x += 0.01;
			this.logo.rotation.z -= 0.01;
		}
		this.render();
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
	
	useControls() {
		const controls = new THREE.OrbitControls(this.camera, this.container);
		controls.timer = null;
		controls.rotateSpeed = 0.2;
		controls.enableDamping = true;
		controls.dampingFactor = 0.3;
		controls.maxDistance = 4000;
		controls.panningMode = THREE.ScreenSpacePanning;
		controls.panSpeed = 0.5;
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.4;
		controls.addEventListener('end', () => {
			controls.autoRotate = false;
		}, false);
		controls.addEventListener('end', () => {
			clearTimeout(controls.timer);
			controls.timer = setTimeout(() => {
				controls.autoRotate = true;
			}, 1000);
		}, false);
		this.controls = controls;
	}

	initAudio() {
		const listener = new THREE.AudioListener();
		this.scene.add( listener );
		const audio = new THREE.Audio( listener );
		this.scene.add( audio );
		const fftSize = 512;
		this.fftSize = fftSize;
		const analyser = new THREE.AudioAnalyser( audio, fftSize );
		this.analyser = analyser;
		const audioLoader = new THREE.AudioLoader();
		audioLoader.load(music, (buffer) => {
			audio.setBuffer( buffer );
			audio.setLoop( true );
			audio.setVolume( 0.5 );
			audio.play();
		},  (xhr) => {
			const total = 5874479;
			const process = Math.ceil(xhr.loaded / total * 100);
			const dom = document.querySelector('#loading>p>span');
			dom.innerHTML = process;
			if (process === 100) {
				document.querySelector('#loading').classList.add('hide');
			}
		});
	}

	initCubes() {
		const n = this.fftSize / 2;
		const sqrt = Math.sqrt(n);

		const cubeBox = new THREE.Object3D();
		cubeBox.name = 'box';
		this.cubeBox = cubeBox;
		this.scene.add(cubeBox);

		let matrix = Array.from(new Array(sqrt - 1), () => [ 0, 0 ]);
		setMatrix(matrix, 0, 0, 0, sqrt - 1);

		matrix.forEach((row, y) => {
			y *= 100;
			row.forEach((col, x) => {
				x *= 100;
				const cube = createNote(col);
				cube.name = 'cube' + col;
				cube.position.set(
					x,
					0,
					y
				);
				cubeBox.add(cube);
			});
		});

		const { center } = this.computedBounding(cubeBox);
		cubeBox.position.set(-center.x, -center.y, -center.z);

		function createNote(i) {
			const cubeGeo = new THREE.CylinderGeometry(40, 40, 255);
			const cubeMtl = new THREE.MeshPhongMaterial({
				color: new THREE.Color(`rgb(${255 - i}, ${20 + i}, ${10 + i})`),
				transparent: true,
				opacity: 1,
				specular: 0x404078,
				shininess: 20
			});
			return new THREE.Mesh(cubeGeo, cubeMtl);
		}

		function setMatrix(matrix, x, y, start, n) {
			let i, j;
			if (n <= 0) {
				return;
			}
			if (n == 1) {
				matrix[x][y] = start;
				return;
			}
			for (i = x; i < x + n-1; i++) { // 上部
				matrix[y][i] = start++;
			}
			for (j = y; j < y + n-1; j++) { //右边
				matrix[j][x+n-1] = start++;
			}
			for (i = x+n-1; i > x; i--) { // 底部
				matrix[y+n-1][i] = start++;
			}
			for (j = y+n-1; j > y; j--) { // 左边
				matrix[j][x] = start++;
			}
			setMatrix(matrix, x+1, y+1, start, n-2); // 递归
		}
	}

	initLogo() {
		const cubeGeo = new THREE.CubeGeometry(400, 400, 400);
		const materials = Array.from(new Array(6), () => {
			return new THREE.MeshPhongMaterial({
				normalMap: new THREE.TextureLoader().load(logo),
				specular: 0x404078,
				shininess: 60
			});
		});
		const cube = new THREE.Mesh(cubeGeo, materials);
		cube.position.y = 400;
		this.logo = cube;
		this.scene.add(cube);
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