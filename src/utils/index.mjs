import { exec } from 'child_process';
import * as fs from 'fs';

export default function runCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error('Error', error.message);
				reject(error);
			}

			if (stderr) {
				console.error('Error', stderr);
				reject(stderr);
			}

			// console.log(`Output : ${stdout}`);

			resolve();
		});
	});
}

export function writeFile(filePathDestination, data) {
	fs.writeFile(filePathDestination, data, (err) => {
		if (err) {
			console.error(err);
		}
	});
}
