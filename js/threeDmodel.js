      function modelViewer(model, parent) {
        var self = this;
        self.model_url = model;
        self.parent_id = parent;
        self.spinning = true;
        self.container = document.getElementById( parent );
        self.camera = new THREE.PerspectiveCamera( 35, 4/3, .1, 1000 );
        self.cameraTarget = new THREE.Vector3( 0, 10, 0 );
        self.scene = new THREE.Scene();
        self.renderer = new THREE.WebGLRenderer( { antialias: true } );
        self.controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
        self.modelGroup = new THREE.Group();
        self.spinBtn = document.createElement("BUTTON");
        self.init = function() {

        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        self.camera.position.set( -60, 100, 200 );

        self.camera.lookAt( self.cameraTarget );

        self.scene.fog = new THREE.Fog( 0x72645b, 1, 1000 );

        self.renderer.setPixelRatio( window.devicePixelRatio );
        self.renderer.setSize( 400, 300);
        //self.renderer.domELement.width = 400;
        //self.renderer.domElement.height = 300;
        self.renderer.setClearColor( self.scene.fog.color );
        self.renderer.gammaInput = true;
        self.renderer.gammaOutput = true;
        self.renderer.shadowMap.enabled = true;
        self.renderer.shadowMap.renderReverseSided = false;

        self.container.appendChild( self.renderer.domElement );

        // controls
        self.controls.minDistance = 50;
        self.controls.maxDistance = 300;
        self.controls.maxPolarAngle = Math.PI / 2;

        // helper
        self.scene.add( new THREE.AxisHelper( 120 ) );

        // Ground
        var plane = new THREE.Mesh(
          new THREE.PlaneBufferGeometry( 200, 200 ),
          new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
        );
        plane.rotation.x = -Math.PI/2;
        plane.position.y = -.1;
        self.scene.add( plane );

        plane.receiveShadow = true;
        self.scene.add( new THREE.GridHelper( 200, 200 ) );


        // .stl model from an ASCII file

        var loader = new THREE.STLLoader();
        loader.load( self.model_url, function ( geometry ) {

          var material = new THREE.MeshPhongMaterial( { color: 0x3333ff, specular: 0x111111, shininess: 200 } );
          var mesh = new THREE.Mesh( geometry, material );

          mesh.position.set( 0, 7, 0 );
          mesh.rotation.set( - Math.PI / 2, 0, 0 );
          mesh.scale.set( 1, 1, 1 );

          mesh.castShadow = true;
          mesh.receiveShadow = true;

          self.modelGroup.add( mesh );

        } );

        self.scene.add( self.modelGroup );

        // Lights
        self.scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );

        directionalLight.position.set( 150, 150, 150);
        self.scene.add( directionalLight );

        directionalLight.castShadow = true;

        var d = 150;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;

        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 500;

        directionalLight.shadow.camera.lookAt( self.cameraTarget );

        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;

        directionalLight.shadow.bias = -0.005;

        window.addEventListener( 'resize', self.onWindowResize, false );

        var t = document.createTextNode("Toggle Spinning");       
        self.spinBtn.appendChild(t);

        self.container.appendChild( self.spinBtn );

        self.spinBtn.addEventListener( "click", function() {
          if (self.spinning) { self.spinning = false;} else {self.spinning = true;}
        } );
        self.onWindowResize();
      };
     

      self.onWindowResize = function () {
        self.camera.aspect = 4/3;
        self.camera.updateProjectionMatrix();
        var w = self.container.clientWidth - 50;
        var h = .75*w;
        self.renderer.setSize( w, h);
      };

      self.animate = function() {

        requestAnimationFrame(function () {
                self.animate();
            });

        if (self.spinning) {
          self.modelGroup.rotation.y += 0.003;
        }

        self.renderer.render(self.scene, self.camera);

      };
}
