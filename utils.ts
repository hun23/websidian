import { scrypt, randomFill, createCipheriv } from "crypto";

interface DirectoryStructure {
	[key: string]: DirectoryStructure | null;
}

type encryptedResult = {
	structure: string;
	files: string[];
};

function createEncryptedFileToUpload(pw: string): encryptedResult {
	const result: encryptedResult = {
		structure: "",
		files: [],
	};
	const files = app.vault.getFiles();
	// encrypt
	const pathIndexMap: Map<string, number> = new Map<string, number>();
	files.forEach(async (file) => {
		const fileBuffer = await app.vault.readBinary(file);
		scrypt(pw, "salt", 32, (err, key) => {
			if (err) {
				console.log(err);
				throw err;
			}
			randomFill(new Uint8Array(16), (err, iv) => {
				if (err) {
					console.log(err);
					throw err;
				}
				const cipher = createCipheriv("aes-256-cbc", key, iv);
				const encryptedBuffer = Buffer.concat([
					cipher.update(Buffer.from(fileBuffer)),
					cipher.final(),
				]);
				pathIndexMap.set(
					file.path,
					result.files.push(encryptedBuffer.toString("base64")) - 1
				);
			});
		});
	});
	// make directory structre with encryptedFilesIndex & encrypt it
	const directoryStructure: DirectoryStructure = {};
	return result;
}

export { createEncryptedFileToUpload };
