import BHEngine from './classes/BHEngine'
import Settings from './classes/static/Settings'
import defaultSettings from './defaultSettings'
import './style.css'

new BHEngine()

for (const key of Object.keys(defaultSettings)) {
	Settings.subscribe(key as keyof typeof defaultSettings, (newVal, prevVal) => {
		console.log(`${key}: ${prevVal} => ${newVal}`)
	})
}
