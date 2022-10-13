import defaultSettings from '../../defaultSettings'

type SettingsMap = typeof defaultSettings

export default class Settings {
	private static readonly STORAGE_KEY = 'UserSettings'

	private static current: { [key: string]: any } = {}

	public static save() {
		try {
			window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.current))
		} catch (e) {
			console.log(e)
		}
	}

	public static load() {
		try {
			const data = window.localStorage.getItem(this.STORAGE_KEY)
			if (!data) return console.log('No data in localstorage to load')

			for (const [key, value] of JSON.parse(data))
				if (Object.keys(defaultSettings).some((k) => k === key)) this.set(key, value)
		} catch (e) {
			console.log(e)
		}
	}

	public static get<T extends keyof SettingsMap>(key: T): SettingsMap[T] {
		if (this.current[key] !== undefined) return this.current[key]
		else return defaultSettings[key]
	}

	public static set<T extends keyof SettingsMap>(key: T, value: SettingsMap[T]): void {
		const prevValue = this.get(key)
		if (value === prevValue) return

		if (value !== defaultSettings[key]) this.current[key] = value
		else delete this.current[key]

		this.emitChange(key, value, prevValue)
	}

	//Event Emitter
	private static events: { [key: string]: Array<(newValue: any, prevValue: any) => void> } =
		Object.fromEntries(Object.entries(defaultSettings).map(([key]) => [key, []]))

	public static subscribe<T extends keyof SettingsMap>(
		key: T,
		listener: (newValue: SettingsMap[T], prevValue: SettingsMap[T]) => void
	): void {
		this.events[key].push(listener)
	}

	public static unsubscribe<T extends keyof SettingsMap>(
		key: T,
		listenerToRemove: (newValue: SettingsMap[T], prevValue: SettingsMap[T]) => void
	): void {
		this.events[key] = this.events[key].filter((listener) => listener !== listenerToRemove)
	}

	private static emitChange<T extends keyof SettingsMap>(
		key: T,
		newValue: SettingsMap[T],
		prevValue: SettingsMap[T]
	) {
		this.events[key].forEach((callback) => callback(newValue, prevValue))
	}
}
