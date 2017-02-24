var example = (function () {
    "use strict";

    var scene = new THREE.Scene();
    var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();

    var camera;
    var mesh;
    var controls;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var multiplier = 4 / 5;

    function initScene() {
        renderer.setSize(multiplier * width, multiplier * height);
        renderer.setClearColor(0xffffff, 1);
        renderer.shadowMap.enabled = true;
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        addCamera();
        addLight();
        addTrackballControls();
        addObject();
        addGround();
    }

    function addLight() {
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1, 10);
        directionalLight.position.set(100, 100, 100);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
    }

    function addCamera() {
        camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);

        camera.position.set(0, -50, 50);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.up.set(0, 0, 1);
        scene.add(camera);
    }

    function addTrackballControls() {
        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
    }

    function addObject() {
        var loader = new THREE.OBJLoader();
        loader.load('models/auto.obj', function (object) {
            var material = new THREE.MeshPhongMaterial({
                color: 0x665600,
                specular: 0xffffff,
                emissive: 0,
                shininess: 200,
                shading: THREE.SmoothShading
            });

            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });

            mesh = object;
            mesh.material = material;

            var matrix = mesh.matrix.clone();
            matrix.makeScale(5, 5, 5);
            matrix.multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2));
            mesh.matrixAutoUpdate = false;
            mesh.matrix = matrix;
            
            scene.add(mesh);
            render();
        });
    }

    function addGround() {
        var geometry = new THREE.PlaneGeometry(100, 100);
        var material = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide });
        var plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        scene.add(plane);
    }

    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.bottom = '0px';

    document.body.appendChild(stats.domElement);

    function render() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);

        var matrix = mesh.matrix.clone();
        matrix.multiply(new THREE.Matrix4().makeRotationY(0.01));
        mesh.matrix = matrix;

        stats.update();
    }

    function onDocumentMouseDown(event) {
        var projector = new THREE.Projector();

        var mouseClickVector = new THREE.Vector3(
            event.clientX / width * 2 - 1,
            -event.clientY / height * 2 + 1,
            0.5);

        projector.unprojectVector(mouseClickVector, camera);

        var raycaster = new THREE.Raycaster(camera.position, mouseClickVector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            alert(intersects.length);
        }
    }

    function checkKey(e) {
        var left = 37,
            up = 38,
            right = 39,
            down = 40,
            increment = 1;

        e = e || window.event;

        if (e.keyCode === up) {
            camera.position.z -= increment;
        } else if (e.keyCode === left) {
            camera.position.x -= increment;
        } else if (e.keyCode === down) {
            camera.position.z += increment;
        } else if (e.keyCode === right) {
            camera.position.x += increment;
        }
    }

    function onResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = multiplier * width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(multiplier * width, multiplier * height);
    }

    window.onload = initScene;
    window.onkeydown = checkKey;
    window.onresize = onResize;
    // document.onmousedown = onDocumentMouseDown;

    return {
        scene: scene
    };
})();