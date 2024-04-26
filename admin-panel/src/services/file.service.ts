import APIInstance from '../config/APIInstance';

export default class FileService {
	static async uploadFile(
		location: string,
		file: File,
		onUploadProgress: (val: number) => void = () => {}
	) {
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('location', location);
			const { data } = await APIInstance.post(`/media`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				onUploadProgress: (progressEvent) => {
					onUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1)));
				},
			});
			return data.filepath;
		} catch (err) {
			return null;
		}
	}
}
