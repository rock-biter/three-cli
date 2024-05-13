#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'node:path';
import chalk from 'chalk';
import { program } from 'commander';
import inquirer from 'inquirer';
// import { exec } from 'child_process';
import ora from 'ora';
import runCommand, { writeFile } from './src/utils/index.mjs';
import pkg from './src/utils/configs.cjs';
const { configs } = pkg;

program.version('0.1.0').description('My Node CLI');

// program.option("-l, --lights", "Add lights");
program.option('-n, --name <type>', 'Add your name');
program.action((options) => {
	let { name, lights } = options;

	const prompts = [];

	if (!name) {
		prompts.push({
			type: 'input',
			name: 'name',
			message: 'Project name',
		});
	}

	// if (!lights) {
	// 	prompts.push({
	// 		type: 'list',
	// 		name: 'camera',
	// 		message: 'What camera do you want to use?',
	// 		default: 'Perspective',
	// 		choices: ['Perspective', 'Orthographic'],
	// 	});
	// }

	// prompts.push({
	// 	type: 'checkbox',
	// 	name: 'choice',
	// 	message: 'Choose what you want',
	// 	choices: [
	// 		{
	// 			name: 'Add lights',
	// 			value: 'lights',
	// 		},
	// 		{
	// 			name: 'Add GUI',
	// 			value: 'gui',
	// 		},
	// 		{
	// 			name: 'Add initial objects',
	// 			value: 'cube',
	// 		},
	// 		{
	// 			name: 'Add gsap',
	// 			value: 'gsap',
	// 		},
	// 	],
	// });

	// console.log('lights', options.lights);

	let spinner;

	inquirer
		.prompt([...prompts])
		.then(async (answers) => {
			// console.log(answers.choice);
			// console.log(chalk.green(`${answers.camera} camera.`));
			// console.log(chalk.green(`Hey, ${name || answers.name}!`));
			// console.log(
			// 	lights || answers.lights
			// 		? chalk.green('Lights yes')
			// 		: chalk.red('No lights')
			// );

			name = name || answers.name;

			// return Object.assign({}, answers, options);
		})
		.then(async () => {
			spinner = ora(`Create vite project...`).start();
			// console.log('create vite project');
			return runCommand(`npm create vite@latest ${name} -- --template vanilla`);
		})
		.then(() => {
			spinner.succeed(chalk.green('Done!'));
			spinner = ora(`Installing dependencies...`).start();
			return runCommand(
				`cd ${name} && npm install && npm install three gsap lil-gui`
			);
		})
		.then(() => {
			console.log('Installing dev dependencies');
			return runCommand(
				`cd ${name} && npm install -D tailwindcss postcss autoprefixer`
			);
		})
		.then(async () => {
			spinner.succeed(chalk.green('Done!'));
			spinner = ora(`Preparing 3D scene...`).start();
			const files = ['tailwind.config.js', 'style.css', 'postcss.config.js'];

			files.forEach((fileName) => {
				fs.readFile(
					path.join(configs.INIT_PATH, fileName),
					'utf8',
					async (err, data) => {
						// console.log('data:', data);
						// console.log('err:', err);

						if (data) {
							await writeFile(`${name}/${fileName}`, data);
						}
					}
				);
			});

			fs.readFile(
				path.join(configs.INIT_PATH, './src/stubs/vanilla/main.js'),
				'utf8',
				async (err, data) => {
					// console.log('data:', data);
					// console.log('err:', err);

					if (data) {
						await writeFile(`${name}/main.js`, data);
					}
				}
			);
		})
		.then(() => {
			spinner.succeed(chalk.green('Done!'));
			console.log(
				chalk.green(
					`Done. Now run:	${name !== '.' ? `cd ${name}\n` : ''}	npm run dev`
				)
			);
		})
		.catch((err) => {
			console.log(chalk.red(`Error: ${err}`));
		});
});

program.parse(process.argv);
