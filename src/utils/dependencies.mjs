export function getDependencies(framework) {
	const dependecies = ['gsap', 'lil-gui']

	switch (framework) {
		case 'vanilla':
			dependecies.push('three')
			break
		case 'react':
			dependecies.push(
				'three',
				'@types/three',
				'@react-three/fiber',
				'@react-three/drei'
			)
			break
	}

	return dependecies
}
