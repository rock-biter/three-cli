const f = 2
let aspect = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(
	-f * aspect,
	f * aspect,
	f,
	-f,
	1,
	1000
)
camera.position.set(4, 4, 4)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))
