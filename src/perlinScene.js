import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

export class Store {
    width = window.innerWidth;
    height = window.innerHeight
    aspect = this.width / this.height;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    camera = new THREE.PerspectiveCamera(40, this.aspect, 0.1, 100);
    controls = new OrbitControls(this.camera, this.renderer.domElement);

    ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );
    directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight2 = new THREE.DirectionalLight(0xffbbbb, 0.5);

    composer;

    constructor() {
        this.animate = this.animate.bind(this);

        this.setup();
        this.setupLights();
        this.setupMesh();
        //this.setupComposer();
    }

    setup() {
        this.renderer.setClearColor(new THREE.Color( 0xffffff ), 0);

        this.camera.position.set(-9, 4, -9);
        this.camera.lookAt(0, 0, 0);

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    setupLights() {
        this.directionalLight.position.set(-0.7, 1, -0.2);
        this.directionalLight2.position.set(1, -0.7, -0.6);
        this.scene.add(this.ambientLight);
        this.scene.add(this.directionalLight);
        this.scene.add(this.directionalLight2);
    }

    setupGrid(){

    }

    setupMesh() {
        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial( {color: 0xbbbbbb} );

        const boxes = new THREE.InstancedMesh( geometry, material, 10000);
        boxes.count = 100;

        const rotation = new THREE.Euler(0, 0, 0);
        const quaternion = new THREE.Quaternion().setFromEuler(rotation);
        const scale = new THREE.Vector3(1, 1, 1);

        let s = 0;

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const position = new THREE.Vector3(i, (i*i + j*j)/20, j);
                const matrix = new THREE.Matrix4().compose(position, quaternion, scale);

                boxes.setMatrixAt(s, matrix);
                s++;
            }
        }

        this.scene.add(boxes);
    }

    setupComposer() {
        const pixelRatio = 2;
        const width = pixelRatio*this.width ;
        const height = pixelRatio*this.height;
        const dimensions = new THREE.Vector2(width, height);

        // maybe remove target and go to default
        const target = new THREE.WebGLRenderTarget(width, height);
        target.samples = 4;

        this.composer = new EffectComposer(this.renderer, target);

        const clearPass = new ClearPass(0xffffff, 0);
        const renderPass = new RenderPass( this.scene, this.camera );
        const outlinePass = new OutlinePass(dimensions, this.scene, this.camera);

        outlinePass.visibleEdgeColor.set('#ffffff');
        outlinePass.hiddenEdgeColor.set('#ffffff');
        outlinePass.edgeGlow = 0;
        outlinePass.edgeStrength = 7;
        outlinePass.edgeThickness = 1;

        this.composer.addPass(clearPass);
		this.composer.addPass(renderPass);
        this.composer.addPass(outlinePass);
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        //this.composer.render();

        requestAnimationFrame(this.animate);
    }
}
