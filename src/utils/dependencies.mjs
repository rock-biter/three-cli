export function getDependencies(framework) {
	const dependecies = ['gsap']

	switch (framework) {
		case 'vanilla':
			dependecies.push('three', 'vite-plugin-glsl', 'tweakpane')
			break
		case 'react':
			dependecies.push(
				'three',
				'lil-gui',
				'@types/three',
				'@react-three/fiber',
				'@react-three/drei'
			)
			break
	}

	return dependecies
}
