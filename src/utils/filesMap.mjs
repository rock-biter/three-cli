import * as path from 'node:path'

const vanillaFilesMap = [
	{
		fileName: 'style.css',
		fromPath: path.join('src', 'stubs', frameworkFolder('vanilla')),
		toPath: '',
	},
]

const reactFilesMap = [
	{
		fileName: 'tailwind.config.js',
		fromPath: path.join('src', 'stubs', frameworkFolder('react')),
		toPath: '',
	},
	{
		fileName: 'index.css',
		fromPath: path.join('src', 'stubs', frameworkFolder('react')),
		toPath: path.join('src'),
	},
	{
		fileName: 'postcss.config.js',
		fromPath: path.join('src', 'stubs', frameworkFolder('react')),
		toPath: '',
	},
	{
		fileName: 'App.jsx',
		fromPath: path.join('src', 'stubs', frameworkFolder('react')),
		toPath: path.join('src'),
	},
	{
		fileName: 'Scene.jsx',
		fromPath: path.join('src', 'stubs', frameworkFolder('react')),
		toPath: path.join('src'),
	},
	{
		fileName: '.eslintrc.cjs',
		fromPath: path.join('src', 'stubs', frameworkFolder('react')),
		toPath: '',
	},
]

export default function getFilesMap({ framework }) {
	const files = {
		vanilla: vanillaFilesMap,
		react: reactFilesMap,
	}

	return files[framework]
}

function frameworkFolder(framework) {
	switch (framework) {
		case 'vanilla':
		case 'react':
			return framework
	}
}
