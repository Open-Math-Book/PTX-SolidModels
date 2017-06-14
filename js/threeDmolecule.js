      function moleculeViewer(model, parent) {
        var self = this;
        self.model_url = model;
        self.parent_id = parent;
        self.spinning = true;
        self.container = document.getElementById( parent );
        self.camera = new THREE.PerspectiveCamera( 35, 4/3, .1, 1000 );
        self.cameraTarget = new THREE.Vector3( 0, 0, 0 );
        self.scene = new THREE.Scene();
        self.renderer = new THREE.WebGLRenderer( { antialias: true } );
        self.controls = new THREE.OrbitControls( self.camera, self.renderer.domElement );
        self.root = new THREE.Group();
        self.spinBtn = document.createElement("BUTTON");
        self.loader = new THREE.PDBLoader();
        self.init = function() {

        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        self.camera.position.set( -30, 50, 100 );

        self.camera.lookAt( self.cameraTarget );
              
        self.renderer.setPixelRatio( window.devicePixelRatio );
        self.renderer.setSize( 400, 300);
        //self.renderer.domELement.width = 400;
        //self.renderer.domElement.height = 300;
        //self.renderer.setClearColor( self.scene.fog.color );
        self.renderer.gammaInput = true;
        self.renderer.gammaOutput = true;
        self.renderer.shadowMap.enabled = true;
        self.renderer.shadowMap.renderReverseSided = false;

        self.container.appendChild( self.renderer.domElement );

        // controls
        self.controls.minDistance = 10;
        self.controls.maxDistance = 200;
        self.controls.maxPolarAngle = .9*Math.PI;

        // .pdb model from a file
              
        self.loadMolecule( "models/molecules/caffeine.pdb" );

        
        self.scene.add( self.root );

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
        var w = self.container.clientWidth;
        var h = .75*w;
        //self.renderer.setSize( 700, 525);
        self.renderer.setSize( w, h);
        //self.renderer.setSize( 400, 300);
        //self.container.setSize(w, h);
      };

      self.animate = function() {

        requestAnimationFrame(function () {
                self.animate();
            });
        self.controls.update();
            
        if (self.spinning) {
          self.root.rotation.x += 0.003;
          self.root.rotation.y += 0.002;
        }

        self.renderer.render(self.scene, self.camera);

      };
      function self.loadMolecule( url ) {
	      while ( self.root.children.length > 0 ) {
			var object = self.root.children[ 0 ];
			object.parent.remove( object );
		}
		self.loader.load( url, function ( geometry, geometryBonds, json ) {
					var boxGeometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
					var sphereGeometry = new THREE.IcosahedronBufferGeometry( 1, 2 );
					var offset = geometry.center();
					geometryBonds.translate( offset.x, offset.y, offset.z );
					var positions = geometry.getAttribute( 'position' );
					var colors = geometry.getAttribute( 'color' );
					var position = new THREE.Vector3();
					var color = new THREE.Color();
					for ( var i = 0; i < positions.count; i ++ ) {
						position.x = positions.getX( i );
						position.y = positions.getY( i );
						position.z = positions.getZ( i );
						color.r = colors.getX( i );
						color.g = colors.getY( i );
						color.b = colors.getZ( i );
						var element = geometry.elements[ i ];
						var material = new THREE.MeshPhongMaterial( { color: color } );
						var object = new THREE.Mesh( sphereGeometry, material );
						object.position.copy( position );
						object.position.multiplyScalar( 75 );
						object.scale.multiplyScalar( 25 );
						self.root.add( object );
						var atom = json.atoms[ i ];
						var text = document.createElement( 'div' );
						text.className = 'label';
						text.style.color = 'rgb(' + atom[ 3 ][ 0 ] + ',' + atom[ 3 ][ 1 ] + ',' + atom[ 3 ][ 2 ] + ')';
						text.textContent = atom[ 4 ];
						var label = new THREE.CSS2DObject( text );
						label.position.copy( object.position );
						self.root.add( label );
					}
					positions = geometryBonds.getAttribute( 'position' );
					var start = new THREE.Vector3();
					var end = new THREE.Vector3();
					for ( var i = 0; i < positions.count; i += 2 ) {
						start.x = positions.getX( i );
						start.y = positions.getY( i );
						start.z = positions.getZ( i );
						end.x = positions.getX( i + 1 );
						end.y = positions.getY( i + 1 );
						end.z = positions.getZ( i + 1 );
						start.multiplyScalar( 75 );
						end.multiplyScalar( 75 );
						var object = new THREE.Mesh( boxGeometry, new THREE.MeshPhongMaterial( 0xffffff ) );
						object.position.copy( start );
						object.position.lerp( end, 0.5 );
						object.scale.set( 5, 5, start.distanceTo( end ) );
						object.lookAt( end );
						self.root.add( object );
					}
					render();
				}, function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
					}
				}, function ( xhr ) {
				} );
			}

}
