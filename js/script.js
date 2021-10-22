const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_URL = 'http://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

const d = document,
  $template = d.getElementById("template-movie").content,
  $fragment = d.createDocumentFragment(),
  $movieContainer = d.querySelector(".movie-container"),
  $form = d.querySelector(".buscador"),
  $buscador = d.querySelector(".buscador input"),
  $lupa = d.querySelector(".lupa-container");

const getMovie = async (url) => {
  try {
    let peticion = await fetch(url),
      json = await peticion.json(),
      {results} = json;
          
    showMovie(results);

    if(!peticion.ok) throw new Error("Ocurrio un error");

  } catch (error) {    
    $movieContainer.textContent = error;
  }    
}

const showMovie = (movie) => {
  $movieContainer.innerHTML = "";

  movie.forEach(movie => {   
    let {poster_path} = movie;
    $template.querySelector("img").src = IMG_PATH + poster_path;
    const $clon = $template.cloneNode(true);
    $fragment.appendChild($clon);
  });

  $movieContainer.appendChild($fragment);
}

d.addEventListener("DOMContentLoaded", () => {
  getMovie(API_URL);
});

$form.addEventListener("keyup", e => {
  e.preventDefault();
  
  let busqueda = $buscador.value;

  if(busqueda !== ""){
    getMovie(SEARCH_URL + busqueda);
  }else{
    getMovie(API_URL);
  }
})