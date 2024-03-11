interface DirectoryStructure {
	[key: string]: DirectoryStructure | null;
}

export function buildDirectoryStructure(paths: string[]): DirectoryStructure {
	const directoryStructure: DirectoryStructure = {}

	paths.forEach((path) => {
		const subPaths = path.split("/")
		let curPath: DirectoryStructure = directoryStructure
		subPaths.forEach((subPath) => {
			if (!(subPath in curPath)) {
				// put binary here?
				curPath[subPath] = {}
			}
			curPath = curPath[subPath]!
			console.log(subPath)
		})
		console.log(directoryStructure)
	})
	return directoryStructure
}
