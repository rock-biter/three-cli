import { getFileContent, writeFile } from '../index.mjs'
import * as path from 'node:path'
import pkg from '../../utils/configs.cjs'
const { configs } = pkg

export default class Builder {
	constructor({ options = {}, projectName }) {
		const {
			camera,
			controls,
			lightTypes = [],
			physics = false,
			helpers = false,
			choice = [], //TODO raname!!
		} = options

		this.camera = camera
		this.lightTypes = lightTypes
		this.projectName = projectName
	}

	async build() {
		// Replace camera placeholder
		let AppData = await getFileContent(
			path.join(`${this.projectName}`, 'src', `App.jsx`)
		)

		AppData = await this.addCamera(AppData)

		writeFile(path.join(`${this.projectName}`, 'src', `App.jsx`), AppData)

		// Replace lights placeholder
		let SceneData = await getFileContent(
			path.join(`${this.projectName}`, 'src', `Scene.jsx`)
		)

		SceneData = await this.addLights(SceneData)

		writeFile(path.join(`${this.projectName}`, 'src', `Scene.jsx`), SceneData)
	}

	async addCamera(fileContent) {
		let cameraData

		switch (this.camera) {
			case 'Perspective':
				cameraData = `camera: {
      fov: 60,
      zoom: 1,
      near: 0.1,
      far: 200,
      position: [ 4, 4, 4 ]
    }`
				break

			case 'Orthographic':
				cameraData = `orthographic: true,
      camera: {
        fov: 60,
        zoom: 180,
        near: 0.1,
        far: 200,
        position: [ 4, 4, 4 ]
      }`
				break
		}

		fileContent = fileContent.replace('__camera__', cameraData)

		return fileContent
	}

	async addLights(fileContent) {
		if (this.lightTypes.length === 0) {
			fileContent = fileContent.replace('__lights__', '')
			return fileContent
		}

		let lightsData

		const lights = await Promise.all([
			...this.lightTypes.map((light) =>
				getFileContent(
					path.join(
						configs.INIT_PATH,
						`src`,
						`stubs`,
						`react`,
						`chunks`,
						`lights`,
						`${light}.jsx`
					)
				)
			),
		])

		lightsData = lights.map((lightData) => lightData).join('\n')

		fileContent = fileContent.replace('__lights__', lightsData)

		return fileContent
	}
}

// export const builder = async (data, options = {}) => {
// 	const {
// 		camera,
// 		controls,
// 		lightTypes = [],
// 		physics = false,
// 		helpers = false,
// 		choice = [], //TODO raname!!
// 	} = options

// 	data = await addCamera(data, camera)

// 	// data = await addLights(data, lightTypes)

// 	return data
// }

// async function addLights(data, lightTypes = []) {
// 	if (lightTypes.length === 0) {
// 		data = data.replace('__lights__', '')
// 		return data
// 	}

// 	let lightsData = `/**
//  * Lights
//  */\n`

// 	const lights = await Promise.all([
// 		...lightTypes.map((light) =>
// 			getFileContent(
// 				path.join(
// 					configs.INIT_PATH,
// 					`src`,
// 					`stubs`,
// 					`vanilla`,
// 					`chunks`,
// 					`lights`,
// 					`${light}.js`
// 				)
// 			)
// 		),
// 	])

// 	lightsData += lights.map((lightData) => lightData).join('')
// 	lightsData += `scene.add(${lightTypes
// 		.map((type) => lightsVarsName[type])
// 		.join(',')})`

// 	data = data.replace('__lights__', lightsData)

// 	return data
// }
