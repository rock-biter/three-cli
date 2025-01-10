#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'node:path'
import chalk from 'chalk'
import { program } from 'commander'
import inquirer from 'inquirer'
// import { exec } from 'child_process';
import ora from 'ora'
import runCommand, {
	getFileContent,
	isEmpty,
	writeFile,
} from './src/utils/index.mjs'
import pkg from './src/utils/configs.cjs'
const { configs } = pkg
import { builder } from './src/utils/vanilla/builder.mjs'
import { getDependencies } from './src/utils/dependencies.mjs'
import getFilesMap from './src/utils/filesMap.mjs'
import Builder from './src/utils/react/builder.mjs'

program.version('0.1.0').description('My Node CLI')

// program.option("-l, --lights", "Add lights");
program.option('-n, --name <type>', 'Add your name')
program.option('-d, --debug', 'Show messages')
program.action((options) => {
	let { name, debug } = options

	const prompts = []

	if (!name) {
		prompts.push({
			type: 'input',
			name: 'name',
			message: 'Project name',
			default: 'my-three-project',
		})
	}

	// TODO add frameworks
	prompts.push({
		type: 'list',
		name: 'framework',
		message: 'Select an option',
		choices: [
			{
				name: 'Vanilla',
				value: 'vanilla',
			},
			{
				name: 'React Three Fiber',
				value: 'react',
			},
		],
	})

	// Camera
	prompts.push(
		{
			type: 'list',
			name: 'camera',
			message: 'What camera do you want to use?',
			default: 'Perspective',
			choices: ['Perspective', 'Orthographic'],
		},
		{
			type: 'list',
			name: 'controls',
			message: 'Choose Camera Controls:',
			default: 'Perspective',
			choices: [
				{
					name: 'OrbitControl',
					value: 1,
				},
				{
					name: 'TrackballControl',
					value: 2,
				},
				{
					name: 'FirstPersonControl',
					value: 3,
				},
				{ name: 'None', value: false },
			],
			when: (answers) => {
				return false
				return answers.camera === 'Perspective'
			},
			default: 0,
		}
	)

	// id perspective camera ask for controls

	prompts.push({
		type: 'checkbox',
		name: 'lightTypes',
		message: 'Choose all the lights you need:',
		choices: [
			{
				name: 'Ambient',
				value: 'ambient',
				checked: true,
			},
			{
				name: 'Directional',
				value: 'directional',
				checked: true,
			},
			// TODO add spot light
			// TODO add Rectangular light,
		],
		default: false,
	})

	// TODO Do you want physics
	// prompts.push({
	// 	type: 'list',
	// 	name: 'physics',
	// 	message: 'Do you need physics?',
	// 	default: false,
	// 	choices: [
	// 		{
	// 			name: 'None',
	// 			value: false,
	// 		},
	// 		{
	// 			name: 'Rapier',
	// 			value: 'rapier',
	// 		},
	// 		{
	// 			name: 'Cannon',
	// 			value: 'cannon-es',
	// 		},
	// 	],
	// })

	// TODO helpers
	// prompts.push({
	// 	type: 'confirm',
	// 	name: 'helpers',
	// 	message: 'Do you want helpers in the scene?',
	// 	default: false,
	// })

	// TODO dependecies
	// prompts.push({
	// 	type: 'checkbox',
	// 	name: 'choice',
	// 	message: 'Do you need this functionalities?',
	// 	choices: [
	// 		{
	// 			name: 'GUI',
	// 			value: 'lil-gui',
	// 			checked: true,
	// 		},
	// 		{
	// 			name: 'gsap',
	// 			value: 'gsap',
	// 			checked: true,
	// 		},
	// 		{
	// 			name: 'tailwindcss',
	// 			value: 'tailwindcss',
	// 			checked: false,
	// 		},
	// 	],
	// })

	// console.log('lights', options.lights);

	let spinner

	inquirer
		.prompt([...prompts])
		.then(async (answers) => {
			// console.log(answers)
			name = name || answers.name
			name = name.replaceAll(' ', '-')

			spinner = ora(`Check project name...`).start()

			// if(!isEmpty)
			// console.log('exists: ', fs.existsSync(`${name}`))
			// console.log('empty: ', isEmpty(`${name}`))
			if (fs.existsSync(`${name}`) && !isEmpty(`${name}`)) {
				throw `This folder is not empty: ${name}`
			}

			return Object.assign({}, answers, options)
		})
		.then(async (answers) => {
			spinner.succeed(chalk.bgGreen('Done!'))
			await runCommand('npm install -g create-vite', debug)

			return answers
		})
		.then(async (answers) => {
			spinner = ora(`Create vite project...`).start()
			// console.log('create vite project');

			let command

			switch (answers.framework) {
				case 'vanilla':
					command = `npm create vite@latest ${name} -- --template vanilla`
					break
				case 'react':
					command = `npm create vite@latest ${name} -- --template react`
					break
			}

			await runCommand(
				command,
				// `npm create vite@latest ${name}`,
				debug
			)

			return answers
		})
		.then(async (answers) => {
			spinner.succeed(chalk.bgGreen('Done!'))
			spinner = ora(`Installing dependencies...`).start()

			const dependencies = getDependencies(answers.framework)

			// install dependencies
			await runCommand(`cd ${name} && npm install`, debug)

			await runCommand(
				`cd ${name} && npm install ${dependencies.join(' ')}`,
				debug
			)

			// install dev dependencies
			await runCommand(
				`cd ${name} && npm install -D tailwindcss postcss autoprefixer`,
				debug
			)

			return answers
		})
		.then(async (answers) => {
			spinner.succeed(chalk.bgGreen('Done!'))
			spinner = ora(`Preparing 3D scene...`).start()
			// const files = ['tailwind.config.js', 'style.css', 'postcss.config.js']
			const { framework } = answers

			const files = getFilesMap({
				framework,
			})

			for await (const file of files) {
				const { fileName, fromPath, toPath } = file

				const data = await getFileContent(
					path.join(configs.INIT_PATH, fromPath, fileName)
				)

				if (data) {
					writeFile(path.join(`${name}`, toPath, `${fileName}`), data)
				}
			}

			if (framework === 'react') {
				const builder = new Builder({ projectName: name, options: answers })
				await builder.build()
			}

			if (framework === 'vanilla') {
				const jsData = await getFileContent(
					path.join(configs.INIT_PATH, 'src', 'stubs', 'vanilla', 'scene.js')
				)

				const cssData = await getFileContent(
					path.join(configs.INIT_PATH, 'src', 'stubs', 'vanilla', 'style.css')
				)

				if (jsData) {
					writeFile(
						path.join(`${name}`, 'src', `main.js`),
						await builder(jsData, answers)
					)
					// console.log(chalk.green('Main.js copied!'))
				}

				if (cssData) {
					writeFile(path.join(`${name}`, 'src', `style.css`), cssData)
					// console.log(chalk.green('style.css copied!'))
				}
			}
		})
		.then(() => {
			spinner.succeed(chalk.bgGreen('Done!'))
			console.log(chalk.gray('--------'))
			console.log(
				chalk.cyan.bold(
					`\nNow run:\n\n${name !== '.' ? ` cd ${name}\n` : ''} npm run dev\n`
				)
			)
			console.log(chalk.gray('--------'))
		})
		.catch((err) => {
			spinner.fail(chalk.red(`Error: ${err}`))
			// console.log(chalk.red(`Error: ${err}`))
		})
		.finally(() => {
			if (spinner.isSpinning) {
				spinner.info(chalk.cyan(`Finish!`))
			}
		})
})

program.parse(process.argv)
