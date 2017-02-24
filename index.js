var example = (function () {
    "use strict";

    var scene = new THREE.Scene();
    var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();

    var camera;
    var mesh;
    var controls;
    var width = window.innerWidth;
    var height = window.innerHeight;

    function initScene() {
        renderer.setSize(4 / 5 * width, 4 / 5 * height);
        renderer.shadowMapEnabled = true;
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        var spotLight = new THREE.SpotLight(0xffffff, 2);
        spotLight.position.set(2, 12, 10);
        spotLight.castShadow = true;
        scene.add(spotLight);

        spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(-2, 12, 10);
        scene.add(spotLight);

        spotLight = new THREE.SpotLight(0xffffcc, 2);
        spotLight.position.set(2000, 1200, 10000);
        scene.add(spotLight);

        camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000);

        camera.position.set(0, -50, 50);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.up.set(0, 0, 1);
        scene.add(camera);

        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 4.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        // var geometry = new THREE.Geometry();
        // geometry.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0));
        // geometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        // geometry.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));

        // geometry.faces.push(new THREE.Face3(0, 1, 2));

        // geometry.faces[0].vertexColors[0] = new THREE.Color(0xFF0000);
        // geometry.faces[0].vertexColors[1] = new THREE.Color(0x00FF00);
        // geometry.faces[0].vertexColors[2] = new THREE.Color(0x0000FF);

        // var material = new THREE.MeshBasicMaterial({
        //     vertexColors: THREE.VertexColors,
        //     side: THREE.DoubleSide
        // });

        // mesh = new THREE.Mesh(geometry, material);

        // mesh.name = "mesh";
        // scene.add(mesh);

        var loader = new THREE.STLLoader();
        loader.load('models/house.stl', function (geometry) {
            var material = new THREE.MeshPhongMaterial({
                color: 0x000000, 
                specular: 0xffffff, 
                combine: THREE.MultiplyOperation
            });
            mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            scene.add(mesh);
            render();
        });

        var geometry = new THREE.PlaneGeometry(100, 100);
        var material = new THREE.MeshPhongMaterial({ color: 0x000000 });
        var plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        scene.add(plane);
    };

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
        mesh.rotation.z += 0.01;

        stats.update();
    };

    function onDocumentMouseDown(event) {
        var projector = new THREE.Projector();

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

    window.onload = initScene;
    window.onkeydown = checkKey;
    // document.onmousedown = onDocumentMouseDown;

    return {
        scene: scene
    };
})();