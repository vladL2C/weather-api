/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const apiKey = '950de3e34e70eb7225ad3e90cada447d';
const searchCity = document.querySelector('.input.is-info');
const loader = document.querySelector('.not-loading');
let weatherImg = document.querySelector('.weather-image');
let cityName = document.querySelector('.title');
let degrees = document.querySelector('.subtitle');
let tempUnit = document.querySelector('.button.is-danger.is-rounded');

tempUnit.addEventListener('click', function() {
  if (tempUnit.textContent === 'Metric') {
    tempUnit.textContent = 'Imperial';
  } else {
    tempUnit.textContent = 'Metric';
  }
});

searchCity.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    run(gen).catch(err => alert(err.message));
    resetRender();
  }
});

function resetRender() {
  weatherImg.src = "";
  loader.classList.add('loader');
  searchCity.value = "";
  cityName.textContent = "";
  degrees.textContent = "";

}

function run(generator) {
  const genObject = generator();

  function iterate(iteration) {
    if (iteration.done) return Promise.resolve(iteration.value);

    return Promise.resolve(iteration.value)
    .then(data => iterate(genObject.next(data)))
    .catch(data => iterate(genObject.throw(data)));
  }

  try {
    return iterate(genObject.next());
  } catch (err) {
    return Promise.reject(err);
  }

}


function *gen() {
  let weatherResponse = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity.value}&APPID=${apiKey}&units=${tempUnit.textContent}`);
  let weather = yield weatherResponse.json();
  if (weather.cod === '404') {
    loader.classList.remove('loader');
    throw new Error(`${weather.message} try again`);
  }

  setTimeout(() => {
    loader.classList.remove('loader')
    const icon = weather.weather[0].icon;
    weatherImg.src = `http://openweathermap.org/img/w/${icon}.png`;
    cityName.textContent = weather.name;
    degrees.textContent = weather.main.temp.toFixed().toString() + `${tempUnit.textContent === "Metric" ? "°C" : "°F"}`;
  },1000);

}

/***/ })
/******/ ]);