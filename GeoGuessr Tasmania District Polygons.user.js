// ==UserScript==
// @name         GeoGuessr Tasmania District Polygons
// @description  Overlays Tasmania district polygons on the map
// @version      0.1
// @author       miraclewhips & macca
// @match        *://*.geoguessr.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @copyright    2022, miraclewhips (https://github.com/miraclewhips)
// @license      MIT
// ==/UserScript==



/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */


const colorMap = {
    'WELLINGTON': '#3ce67b',
    'DEVON': '#f8a30c',
    'DORSET': '#cefef2',
    'RUSSELL': '#ffffcf',
    'MONTAGU': '#fed0d0',
    'LINCOLN': '#cefef2',
    'WESTMORLAND': '#fed0d0',
    'CORNWALL': '#ffffcf',
    'MONTGOMERY': '#f8a30c',
    'FRANKLIN': '#ffffcf',
    'CUMBERLAND': '#ffffcf',
    'SOMERSET': '#cefef2',
    'GLAMORGAN': '#3ce67b',
    'MONMOUTH': '#f8a30c',
    'BUCKINGHAM': '#3ce67b',
    'PEMBROKE': '#ffffcf',
    'ARTHUR': '#cefef2',
    'KENT': '#ffffcf'
}


// Script injection, extracted from unityscript extracted from extenssr:
// https://gitlab.com/nonreviad/extenssr/-/blob/main/src/injected_scripts/maps_api_injecter.ts
function overrideOnLoad(googleScript, observer, overrider) {
	const oldOnload = googleScript.onload
	googleScript.onload = (event) => {
			const google = window.google
			if (google) {
					observer.disconnect()
					overrider(google)
			}
			if (oldOnload) {
					oldOnload.call(googleScript, event)
			}
	}
}

function grabGoogleScript(mutations) {
	for (const mutation of mutations) {
			for (const newNode of mutation.addedNodes) {
					const asScript = newNode
					if (asScript && asScript.src && asScript.src.startsWith('https://maps.googleapis.com/')) {
							return asScript
					}
			}
	}
	return null
}

function injecter(overrider) {
	if (document.documentElement)
	{
			injecterCallback(overrider);
	}
}

function injecterCallback(overrider)
{
	new MutationObserver((mutations, observer) => {
			const googleScript = grabGoogleScript(mutations)
			if (googleScript) {
					overrideOnLoad(googleScript, observer, overrider)
			}
	}).observe(document.documentElement, { childList: true, subtree: true })
}

document.addEventListener('DOMContentLoaded', (event) => {
    injecter(() => {
		google.maps.Map = class extends google.maps.Map {
			constructor(...args) {
				super(...args);
				this.data.loadGeoJson('https://raw.githubusercontent.com/macca7224/tasmania-streaks/main/tasdistricts.geojson');
					this.data.setStyle((feature) => {
							const name = feature.getProperty('LAND_DIST');
							const color = colorMap[name];

							return {
									fillOpacity: 0.2,
									fillColor: color,
									strokeWeight: 1,
									clickable: false
							}
					});
			}
		}
	});
});
