import Audio from './Audio'

export default class Samples {
	private static collection: Map<string, AudioBuffer>
	static {
		this.collection = new Map<string, AudioBuffer>()
	}

	public static batchLoad(list: string[]): Promise<string> {
		return Promise.all(list.map((path) => this.load(path))).then(
			() => `Successfully loaded ${list.length} samples!`
		)
	}

	public static load(path: string): Promise<string> {
		return new Promise((res, rej) => {
			if (this.collection.has(path)) console.log(`Overwriting ${path}`)

			fetch(path)
				.then((res) => res.arrayBuffer())
				.then((data) => Audio.context.decodeAudioData(data))
				.then((buffer) => {
					this.collection.set(path, buffer)
					res(`Successfully loaded sample: ${path}`)
				})
				.catch(rej)
		})
	}

	public static get(path: string) {
		if (this.collection.has(path)) return this.collection.get(path)
		else return null
	}
}
