#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'node:path'
import chalk from 'chalk'
import { program } from 'commander'
import inquirer from 'inquirer'
// import { exec } from 'child_process';
import ora from 'ora'
import runCommand, { getFileContent, writeFile } from './src/utils/index.mjs'
import pkg from './src/utils/configs.cjs'
const { configs } = pkg
import { builder } from './src/utils/vanilla/builder.mjs'

program.version('0.1.0').description('My Node CLI')

// program.option("-l, --lights", "Add lights");
program.option('-n, --name <type>', 'Add your name')
program.action((options) => {
	let { name, lights } = options

	const prompts = []

	if (!name) {
		prompts.push({
			type: 'input',
			name: 'name',
			message: 'Project name',
			default: '.',
		})
	}

	// TODO add frameworks
	// prompts.push({
	// 	type: 'list',
	// 	name: 'framework',
	// 	message: 'Select an option',
	// 	choices: ['Vanilla'],
	// });

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

			return Object.assign({}, answers, options)
		})
		.then(async (answers) => {
			spinner = ora(`Create vite project...`).start()
			// console.log('create vite project');
			await runCommand(`npm create vite@latest ${name} -- --template vanilla`)

			return answers
		})
		.then(async (answers) => {
			spinner.succeed(chalk.green('Done!'))
			spinner = ora(`Installing dependencies...`).start()
			await runCommand(
				`cd ${name} && npm install && npm install three gsap lil-gui`
			)

			return answers
		})
		.then(async (answers) => {
			// console.log('Installing dev dependencies');
			await runCommand(
				`cd ${name} && npm install -D tailwindcss postcss autoprefixer`
			)

			return answers
		})
		.then(async (answers) => {
			spinner.succeed(chalk.green('Done!'))
			spinner = ora(`Preparing 3D scene...`).start()
			const files = ['tailwind.config.js', 'style.css', 'postcss.config.js']

			files.forEach((fileName) => {
				fs.readFile(
					path.join(configs.INIT_PATH, fileName),
					'utf8',
					async (err, data) => {
						// console.log('data:', data);
						// console.log('err:', err);

						if (data) {
							await writeFile(`${name}/${fileName}`, data)
						}
					}
				)
			})

			const data = await getFileContent(
				path.join(configs.INIT_PATH, './src/stubs/vanilla/scene.js')
			)

			if (data) {
				writeFile(`${name}/main.js`, await builder(data, answers))
				console.log(chalk.green('Main.js copied!'))
			}
		})
		.then(() => {
			spinner.succeed(chalk.green('Done!'))
			console.log(
				chalk.green(
					`Done. Now run:	${name !== '.' ? `cd ${name}\n` : ''}	npm run dev`
				)
			)
		})
		.catch((err) => {
			spinner.fail(chalk.red(`Error: ${err}`))
			// console.log(chalk.red(`Error: ${err}`))
		})
})

program.parse(process.argv)
