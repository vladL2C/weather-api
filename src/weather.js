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