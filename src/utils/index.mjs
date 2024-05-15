import { rejects } from 'assert'
import { exec } from 'child_process'
import * as fs from 'fs'

export default function runCommand(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error('Error', error.message)
				reject(error)
			}

			if (stderr) {
				console.error('Error', stderr)
				reject(stderr)
			}

			// console.log(`Output : ${stdout}`);

			resolve()
		})
	})
}

export function writeFile(filePathDestination, data) {
	fs.writeFileSync(filePathDestination, data, (err) => {
		if (err) {
			console.error(err)
		}
	})
}

export function getFileContent(path, encoding = 'utf-8') {
	return new Promise((resolve, reject) => {
		fs.readFile(path, encoding, (err, data) => {
			if (err) reject()
			else resolve(data)
		})
	})
}
