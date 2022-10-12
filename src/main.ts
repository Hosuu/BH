import BHEngine from './classes/BHEngine'
import Settings from './classes/static/Settings'
import './style.css'

new BHEngine()

Settings.subscribe('mouseControl', (newVal, prevVal) => {
	console.log(`mouseControl: ${prevVal} => ${newVal}`)
})
