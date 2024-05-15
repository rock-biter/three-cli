const fov = 60;
const camera = new THREE.PerspectiveCamera(
	fov,
	sizes.width / sizes.height,
	0.1
);
camera.position.set(4, 4, 4);
camera.lookAt(new THREE.Vector3(0, 2.5, 0));
