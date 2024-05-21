import { getFileContent } from '../index.mjs'
import * as path from 'node:path'
import pkg from '../../utils/configs.cjs'
const { configs } = pkg

const lightsVarsName = {
	ambient: 'ambientLight',
	directional: 'directionalLight',
}

export const builder = async (data, options = {}) => {
	const {
		camera,
		controls,
		lightTypes = [],
		physics = false,
		helpers = false,
		choice = [], //TODO raname!!
	} = options

	data =
		camera === 'Perspective'
			? await addCamera(data, 'PerspectiveCamera')
			: await addCamera(data, 'OrthographicCamera')

	data = await addLights(data, lightTypes)

	return data
}

async function addCamera(data, cameraName) {
	// let cameraName = 'PerspectiveCamera'

	// if (camera === 'Orthographic') {
	// 	cameraName = 'OrthographicCamera'
	// }
	let cameraData = `/**
 * Camera
 */\n`

	cameraData += await getFileContent(
		path.join(
			configs.INIT_PATH,
			`src`,
			`stubs`,
			`vanilla`,
			`chunks`,
			`${cameraName}`,
			`index.js`
		)
	)
	const cameraResizeData = await getFileContent(
		path.join(
			configs.INIT_PATH,
			`src`,
			`stubs`,
			`vanilla`,
			`chunks`,
			`${cameraName}`,
			`resize.js`
		)
	)

	data = data.replace('__camera__', cameraData)
	data = data.replace('__camera_resize__', cameraResizeData)

	return data
}

async function addLights(data, lightTypes = []) {
	if (lightTypes.length === 0) {
		data = data.replace('__lights__', '')
		return data
	}

	let lightsData = `/**
 * Lights
 */\n`

	const lights = await Promise.all([
		...lightTypes.map((light) =>
			getFileContent(
				path.join(
					configs.INIT_PATH,
					`src`,
					`stubs`,
					`vanilla`,
					`chunks`,
					`lights`,
					`${light}.js`
				)
			)
		),
	])

	lightsData += lights.map((lightData) => lightData).join('')
	lightsData += `scene.add(${lightTypes
		.map((type) => lightsVarsName[type])
		.join(',')})`

	data = data.replace('__lights__', lightsData)

	return data
}
