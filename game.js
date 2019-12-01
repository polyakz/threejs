document.addEventListener("DOMContentLoaded", function (array, offset) {
    document.addEventListener("keydown", function(event) {
        if ("73" == event.which) {
            $(".key-combos, .student-name").fadeToggle();
        }
    });

    var WIDTH, HEIGHT, aspectRatio;
    var scene, camera, renderer;
    scene = new THREE.Scene();
    var ctrl, controls;
    var floorMesh;
    var wallMesh;
    var wallMesh2;
    var ceilingMesh;
    var pointLight;
    var legoHuman;
    var legoTree;
    var legoCar;
    var isTweening = false;

    var meshController = function () {
        this.visibleWall = true;
        this.visibleCeiling = true;
        this.visiblePointLight = true;
        this.forward = function () {
            stepForward(0, 1, 1);
        };
        this.backward = function () {
            stepBackward(0, 1, 1);
        };
    };

    function init() {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        aspectRatio = WIDTH / HEIGHT;

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize( WIDTH, HEIGHT );
        renderer.setClearColor( 0xa08080 );
        document.body.appendChild( renderer.domElement );


        camera = new THREE.PerspectiveCamera( 75, aspectRatio, 0.1, 3000 );
        camera.position.set( -600, 600, 800);
        camera.lookAt( scene.position );
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 5.0;
        controls.panSpeed = 1.0;

        // Lights
        var ambientLight = new THREE.AmbientLight(0xf0a0a0);
        var rectLight = new THREE.RectAreaLight(0x0000ff, 0.7,  100, 150);
        rectLight.position.set(150,150, 50);
        rectLight.lookAt(0, 50, 0);
        pointLight = new THREE.PointLight( 0xffffff );
        pointLight.position.set( 100.0, 200.0, 100.0 );
        scene.add(ambientLight);
        scene.add(pointLight);
        scene.add(rectLight);



        // Textures
        var textureLoader = new THREE.TextureLoader();
        var legoWall = textureLoader.load( 'assets/lego.png' );
        var legoLogo = textureLoader.load( 'assets/lego-logo.png' );

        // Floor
        var floor = new THREE.PlaneGeometry( 800, 600 );
        var floorMaterial = new THREE.MeshPhongMaterial( { color: 0x6558A5, side: THREE.DoubleSide, wireframe: false } );
        floorMesh = new THREE.Mesh( floor, floorMaterial );
        floorMesh.rotation.x = THREE.Math.degToRad( -90 );

        // Wall right
        var wall = new THREE.PlaneGeometry( 600, 400);
        var wallMaterial = new THREE.MeshPhongMaterial();
        wallMaterial.map = legoWall;
        wallMesh = new THREE.Mesh( wall, wallMaterial );
        wallMesh.position.x = 400;
        wallMesh.position.y = 200;
        wallMesh.rotation.y = THREE.Math.degToRad( -90 );

        // Wall left
        var wall2 = new THREE.BoxGeometry(400, 800);
        var wallMaterial2 = new THREE.MeshPhongMaterial( { color: 0x9C6318, side: THREE.DoubleSide, wireframe: false } );
        wallMesh2 = new THREE.Mesh( wall2, wallMaterial2 );
        wallMesh2.position.y = 200;
        wallMesh2.position.z = -300;
        wallMesh2.rotation.z = THREE.Math.degToRad( -90 );

        // Ceiling
        var ceiling = new THREE.PlaneGeometry( 800, 600 );
        var ceilingMaterial = new THREE.MeshPhongMaterial( { color: 0x9ED138, side: THREE.DoubleSide, wireframe: false } );
        ceilingMesh = new THREE.Mesh( ceiling, ceilingMaterial );
        ceilingMesh.position.y = 400;
        ceilingMesh.rotation.x = THREE.Math.degToRad( -90 );

        scene.add(floorMesh);
        scene.add(wallMesh);
        scene.add(wallMesh2);
        scene.add(ceilingMesh);

        ctrl = new meshController();
        addControlGui(ctrl);

        window.addEventListener( 'resize', handleWindowResize, false );

        /** LEGO HUMAN **/
        legoHuman = new THREE.Group();
        var legoHumanArmsMaterial = new THREE.MeshPhongMaterial( { color: 0xE56A00, wireframe: false } );
        var legoHumanArmsMaterial2 = new THREE.MeshPhongMaterial( { color: 0x05E500, wireframe: false } );
        var legoHumanLegsMaterial = new THREE.MeshPhongMaterial( { color: 0xBF00B7, wireframe: false } );
        var legoHumanLegsMaterial2 = new THREE.MeshPhongMaterial( { color: 0x0C00E5, wireframe: false } );
        var legoHumanHeadMaterial = new THREE.MeshPhongMaterial( { color: 0xBFA200, wireframe: false } );

        // Torso
        var torso = new THREE.BoxGeometry( 100, 100, 40 );
        var torsoLogo = new THREE.MeshPhongMaterial();
        torsoLogo.map = legoLogo;
        var torsoMesh = new THREE.Mesh(torso, torsoLogo);
        torsoMesh.position.y = 150;
        legoHuman.add(torsoMesh);

        // leg
        var leg = new THREE.BoxGeometry(50, 100, 40);
        var legMesh = new THREE.Mesh(leg, legoHumanLegsMaterial);
        var legMesh2 = new THREE.Mesh(leg, legoHumanLegsMaterial2);
        legMesh.position.y = 50;
        legMesh2.position.y = 50;
        legMesh.position.x = 25;
        legMesh2.position.x = -25;
        legoHuman.add(legMesh, legMesh2);

        //arms
        var arm = new THREE.BoxGeometry(30, 75, 30);
        var armMesh = new THREE.Mesh(arm, legoHumanArmsMaterial);
        var armMesh2 = new THREE.Mesh(arm, legoHumanArmsMaterial2);
        armMesh.position.x = 65;
        armMesh.position.y = 150;
        armMesh.position.z = 20;
        armMesh.rotation.x = THREE.Math.degToRad( -45 );
        armMesh2.position.x = -65;
        armMesh2.position.y = 150;
        armMesh2.position.z = 20;
        armMesh2.rotation.x = THREE.Math.degToRad( -45 );
        legoHuman.add(armMesh, armMesh2);

        //head
        var head = new THREE.CylinderGeometry( 30, 30, 50, 64 );
        var headMesh = new THREE.Mesh(head, legoHumanHeadMaterial);
        headMesh.position.y = 225;
        legoHuman.add(headMesh);

        scene.add(legoHuman);

        /** END **/

        /** LEGO TREE */
        legoTree = new THREE.Group();
        var legoTrunkMaterial = new THREE.MeshPhongMaterial( { color: 0xAD822E, wireframe: false } );
        var legoGreeneryMaterial = new THREE.MeshPhongMaterial( { color: 0x7BAD2E, wireframe: false } );
        var legoAppleMaterial = new THREE.MeshPhongMaterial( { color: 0xE90707, wireframe: false } );

        // Trunk
        var trunk = new THREE.BoxGeometry(50, 200, 40);
        var trunkMesh = new THREE.Mesh(trunk, legoTrunkMaterial);
        trunkMesh.position.x = 250;
        trunkMesh.position.y = 100;
        trunkMesh.position.z = 150;
        legoTree.add(trunkMesh);

        // Greenery
        var greenery = new THREE.SphereGeometry( 125, 32, 4 );
        var greeneryMesh = new THREE.Mesh(greenery, legoGreeneryMaterial);
        greeneryMesh.position.x = 250;
        greeneryMesh.position.y = 250;
        greeneryMesh.position.z = 150;
        legoTree.add(greeneryMesh);

        // apple1
        var apple = new THREE.SphereGeometry(50, 20, 3);
        var appleMesh = new THREE.Mesh(apple, legoAppleMaterial);
        appleMesh.position.x = 250;
        appleMesh.position.y = 250;
        appleMesh.position.z = 250;
        legoTree.add(appleMesh);

        // apple2
        var apple2 = new THREE.SphereGeometry(50, 20, 3);
        var appleMesh2 = new THREE.Mesh(apple2, legoAppleMaterial);
        appleMesh2.position.x = 150;
        appleMesh2.position.y = 300;
        appleMesh2.position.z = 150;
        legoTree.add(appleMesh2);

        // apple3
        var apple3 = new THREE.SphereGeometry(50, 20, 3);
        var appleMesh3 = new THREE.Mesh(apple3, legoAppleMaterial);
        appleMesh3.position.x = 175;
        appleMesh3.position.y = 175;
        appleMesh3.position.z = 200;
        legoTree.add(appleMesh3);

        scene.add(legoTree);
        /** END */

        /** LEGO CAR */
        legoCar = new THREE.Group();
        var legoCarMaterial = new THREE.MeshPhongMaterial( { color: 0x037030, wireframe: false } );
        var legoWheelMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, wireframe: false } );
        var legoWindshieldMaterial = new THREE.MeshLambertMaterial( { color: 0x0000AA, transparent: true } );
        legoWindshieldMaterial.opacity = 0.5;

        // car's body
        var carBody = new THREE.CylinderGeometry(70, 70, 300, 64);
        var carBodyMesh = new THREE.Mesh(carBody, legoCarMaterial);
        carBodyMesh.position.x = -225;
        carBodyMesh.position.y = 75;
        carBodyMesh.position.z = -50;
        carBodyMesh.rotation.x = THREE.Math.degToRad( -90 );
        legoCar.add(carBodyMesh);

        //wheel
        var carWheel = new THREE.CylinderGeometry(40, 40, 50, 64);
        var carWheelMesh = new THREE.Mesh(carWheel, legoWheelMaterial);
        carWheelMesh.position.x = -150;
        carWheelMesh.position.y = 40;
        carWheelMesh.position.z = -150;
        carWheelMesh.rotation.z = THREE.Math.degToRad( -90 );
        carWheelMesh.rotation.x = THREE.Math.degToRad( -90 );
        legoCar.add(carWheelMesh);

        var carWheelMesh2 = new THREE.Mesh(carWheel, legoWheelMaterial);
        carWheelMesh2.position.x = -300;
        carWheelMesh2.position.y = 40;
        carWheelMesh2.position.z = -150;
        carWheelMesh2.rotation.z = THREE.Math.degToRad( -90 );
        carWheelMesh2.rotation.x = THREE.Math.degToRad( -90 );
        legoCar.add(carWheelMesh2);

        var carWheelMesh3 = new THREE.Mesh(carWheel, legoWheelMaterial);
        carWheelMesh3.position.x = -300;
        carWheelMesh3.position.y = 40;
        carWheelMesh3.position.z = 50;
        carWheelMesh3.rotation.z = THREE.Math.degToRad( -90 );
        carWheelMesh3.rotation.x = THREE.Math.degToRad( -90 );
        legoCar.add(carWheelMesh3);

        var carWheelMesh4 = new THREE.Mesh(carWheel, legoWheelMaterial);
        carWheelMesh4.position.x = -150;
        carWheelMesh4.position.y = 40;
        carWheelMesh4.position.z = 50;
        carWheelMesh4.rotation.z = THREE.Math.degToRad( -90 );
        carWheelMesh4.rotation.x = THREE.Math.degToRad( -90 );
        legoCar.add(carWheelMesh4);

        //windshiled
        var windshield = new THREE.CircleBufferGeometry(60, 64);
        var windshieldMesh = new THREE.Mesh( windshield, legoWindshieldMaterial );
        windshieldMesh.position.x = -225;
        windshieldMesh.position.y = 150;
        windshieldMesh.position.z = 25;
        windshieldMesh.rotation.x = THREE.Math.degToRad( -30 );
        legoCar.add(windshieldMesh);

        scene.add(legoCar);
        /** END */

        render();
    }

    function stepForward(start, end, time) {
        var object = legoHuman;
        if (!isTweening) {
            var tween = new TWEEN.Tween({ x: start, object: object, previous: 0})
                .to({ x: end }, time )
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(function () {
                    isTweening = true;
                })
                .onUpdate(function () {
                    object.position.x = this.x;
                })
                .onComplete(function () {
                    // A végső eltolási értékek alkalmazása
                    object.updateMatrix();
                    object.position.set( 0, 0, 100);
                    object.updateMatrix();
                    isTweening = false;
                })
                .start();
        }
    }

    function stepBackward(start, end, time) {
        var object = legoHuman;
        if (!isTweening) {
            var tween = new TWEEN.Tween({ x: start, object: object, previous: 0})
                .to({ x: end }, time )
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(function () {
                    isTweening = true;
                })
                .onUpdate(function () {
                    object.position.x = this.x;
                })
                .onComplete(function () {
                    object.updateMatrix();
                    object.position.set( 0, 0, -100);
                    object.updateMatrix();
                    isTweening = false;
                })
                .start();
        }
    }

    function addControlGui( controlObject ) {
        var gui = new dat.GUI( { autoPlace: false } );
        gui.add(controlObject, 'visibleWall').name('Falak_láthatósága');
        gui.add(controlObject, 'visibleCeiling').name('Plafon_láthatósága');
        gui.add(controlObject, 'visiblePointLight').name('Pontfény_láthatósága');
        gui.add(controlObject, 'forward').name('Ember előre');
        gui.add(controlObject, 'backward').name('Ember hátra');

        gui.domElement.style.position = 'absolute';
        gui.domElement.style.top = '100px';
        gui.domElement.style.left = '10px';
        document.body.appendChild( gui.domElement );
    }

    function handleWindowResize() {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize( WIDTH, HEIGHT );
        aspectRatio = WIDTH / HEIGHT;
        camera.aspect = aspectRatio;
        camera.updateProjectionMatrix();
    }

    function handleWindowResizeOrtho() {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize( WIDTH, HEIGHT );

        camera.left = WIDTH / -2;
        camera.right = WIDTH / 2;
        camera.top = HEIGHT / 2;
        camera.bottom = HEIGHT / -2;
        camera.updateProjectionMatrix();
    }

    var render = function () {
        wallMesh.visible = ctrl.visibleWall;
        wallMesh2.visible = ctrl.visibleWall;
        ceilingMesh.visible = ctrl.visibleCeiling;
        pointLight.visible = ctrl.visiblePointLight;

        legoCar.rotation.y += THREE.Math.degToRad( 1 );

        TWEEN.update();
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame( render );
    };

    function animate() {
        requestAnimationFrame( animate );

    }

    animate();
    init();
});

