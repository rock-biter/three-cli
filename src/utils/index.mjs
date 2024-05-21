import { rejects } from 'assert'
import { exec, spawn } from 'child_process'
import * as fs from 'fs'

export default function runCommand(command, showOut = false) {
	return new Promise((resolve, reject) => {
		// const [comm, ...args] = command.split(' ')
		// // console.log(comm, ...args)
		// const cmd = spawn(comm, args)

		// cmd.stdout.on('data', (data) => {
		// 	if (showOut) console.log(`Output : ${data}`)
		// 	// resolve()
		// })

		// cmd.stderr.on('data', (data) => {
		// 	console.error(`cmd stderr: ${data}`)
		// 	reject(data)
		// })

		// cmd.on('close', (code) => {
		// 	if (code !== 0) {
		// 		console.log(`ps process exited with code ${code}`)
		// 	}
		// 	resolve()
		// })
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error('Error', error.message)
				reject(error)
			}

			if (stderr) {
				console.error('Error', stderr)
				reject(stderr)
			}

			if (showOut) console.log(`Output : ${stdout}`)

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
