import * as THREE from 'three';
import 'threejs/controls/OrbitControls';
import 'threejs/loaders/OBJLoader';
// import TWEEN from 'exports-loader?TWEEN!threejs/libs/tween.min';
import cerberus from './model/gun/Cerberus.obj';
import cerberus_texture_A from './model/gun/Cerberus_A.jpg';

class MyWebGL {
	constructor() {
		MyWebGL.init();
		MyWebGL.resize();
		MyWebGL.useControls();
		MyWebGL.useCapturer();
		MyWebGL.objLoader();
		MyWebGL.animate();
	}
  
	/**
  * @description initialize base environment
  * @inner scene & camera & light & renderer
  */
	static init() {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
		camera.position.set(2.7107714800811777, 1.3756124388041333, 1.14885424554198);

		scene.add(new THREE.AmbientLight(0xcccccc));
		const light = new THREE.SpotLight(0xffffff, 1);
		light.position.set(50, 50, 50);
		scene.add(light);

		const container = document.querySelector('#webgl');
		const renderer = new THREE.WebGLRenderer({
			canvas: container,
			antialias: true,
			alpha: true,
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
  
	/**
  * @description animate loop
  */
	static animate() {
		window.requestAnimationFrame(() => {
			this.animate();
		});
		this.controls.enabled && this.controls.update();
		this.render();
	}
	
	/**
  * @description self-adaption
  */
	static resize() {
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		}, false);
	}
  
	/**
  * @description renderer
  */
	static render() {
		this.renderer.render(this.scene, this.camera);
	}
	
	/**
  * @description camera controls
	* @inner OrbitControls
  */
	static useControls() {
		const controls = new THREE.OrbitControls(this.camera, this.container);
		controls.timer = null;
		controls.rotateSpeed = 0.2;
		controls.enableDamping = true;
		controls.dampingFactor = 0.3;
		controls.panningMode = THREE.ScreenSpacePanning;
		controls.panSpeed = 0.5;
		controls.minDistance = 1;
		controls.maxDistance = 100;
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

	/**
  * @description loader
	* @inner OBJLoader & MTLLoader & TextureLoader
  */
	static objLoader() {
		const loader = new THREE.OBJLoader();
		loader.load(cerberus, object => {
			object.userData.interactive = true;
			const material = new THREE.MeshStandardMaterial();
			const textureLoader = new THREE.TextureLoader();
			material.map = textureLoader.load( cerberus_texture_A );
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material = material;
				}
			} );
			this.scene.add(object);
		});
	}

	/**
  * @description capturer base on raycaster
  */
	static useCapturer(selectedTarget = this.scene) {
		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.animationStage = 1;
		document.addEventListener('mouseup', ev => {
			ev.preventDefault();
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;  
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.raycaster.setFromCamera(this.mouse, this.camera);
			const intersects = this.raycaster.intersectObjects(selectedTarget.children, true);
			if (intersects && intersects.length > 0) {
				const target = MyWebGL.searchModelFromChild(intersects[0].object);
				MyWebGL.selectedFn && MyWebGL.selectedFn(target);
			}
		});
	}

	/**
  * @description selected callback
  */
	static selectedFn(target) {
		console.log(target);
		console.log(this.camera);
	}

	/**
  * @description bounding
  */
	static computedBounding(obj) {
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
	static searchModelFromChild(child) {
		while (child) {
			if (child.userData.interactive) {
				return child;
			}
			child = child.parent;
		}
	}
}

export default MyWebGL;