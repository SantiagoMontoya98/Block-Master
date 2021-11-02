const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_URL = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';
const DETAILS1 = 'https://api.themoviedb.org/3/movie/';
const DETAILS2 = '?api_key=ac7020f4cf002f4c5f7b6d87ae76e0e6&append_to_response=videos';
const YOUTUBE = 'https://www.youtube.com/embed/';
const URL_SCROLL = 'https://api.themoviedb.org/3/movie/popular?api_key=ac7020f4cf002f4c5f7b6d87ae76e0e6&page=';

const d = document,
  w = window,
  $fragment = d.createDocumentFragment(),
  $template = d.getElementById("template-movie").content,
  $movieContainer = d.querySelector(".movie-container"),  
  $form = d.querySelector(".buscador"),
  $buscador = d.querySelector(".buscador input"),
  $lupa = d.querySelector(".lupa-container"),
  $movieDescC = d.querySelector(".movie-description-container"),  
  $notFound = d.querySelector(".not-found");
  

let $movie,
  $btnClose,
  nextPage = 2,
  pelis = [];  

const getMovie = async (url) => {
  try {
    let peticion = await fetch(url),
      json = await peticion.json(),
      {results} = json;
          
    showMovie(results);

    if(!peticion.ok) throw new Error("Ocurrio un error");

    return results;

  } catch (error) {    
    $movieContainer.textContent = error;
  }    
}

const saveMovie = (movie) => movie.forEach(movie => pelis.push(movie));

const showMovie = (movie) => {

  $movieContainer.innerHTML += "";

  movie.forEach(movie => {
    let {title,overview,poster_path,release_date,vote_average, id} = movie;

    $template.querySelector("img").src =  IMG_PATH + poster_path;
    $template.querySelector("img").alt = title;
    $template.querySelector("img").title = title;
    $template.querySelector(".title").textContent = title;
    $template.querySelector(".desc").textContent = overview;
    $template.querySelector(".date").textContent = release_date;
    $template.querySelector(".puntaje").innerHTML = `
      <img src="./images/Estrella.svg" alt="estrella"></img>
      <span>${vote_average}</span>
    `;
    $template.querySelector(".id").textContent = id;
    
    const $clon = $template.cloneNode(true);
    $fragment.appendChild($clon);

  });

  $movieContainer.appendChild($fragment);
  
  $movie = $movieContainer.querySelectorAll(".pelicula");

  $movie.forEach(el => {
    el.addEventListener("click", async () => {

      let $img = el.querySelector("img").src;
        $title = el.querySelector(".title").textContent,
        $desc = el.querySelector(".desc").textContent,
        $date = el.querySelector(".date").textContent,
        $id = el.querySelector(".id").textContent;

      let {genero, url, tiempo} = await getMovieTrailer($id);

      $movieDescC.innerHTML = `
      
        <article class="movie-description">
        <section class="img-trailer">
          <img class="mainImg" src="${$img}" alt="${$title}" title="${$title}">
        </section>        
        <article class="description">
          <h2>${$title}</h2>
          <p>${$desc}</p>          
          <span>${$date} <i class="fas fa-circle"></i></span>
          <span>${genero[0].name} <i class="fas fa-circle"></i></span>
          <span>${tiempo}m</span>          
          <article class="ver">
            <button class="ahora trailerMovie"><img src="./images/flecha.png" alt="flecha">VER AHORA</button>
            <button class="despues"><img src="./images/suma.png" alt="suma">VER DESPUÉS</button>
          </article>
        </article>
        <span class="close">X</span>
      </article>
      
      
      `;

      const $verTrailer = d.querySelector(".trailerMovie"),
        $trailer = d.querySelector(".img-trailer");

      $verTrailer.addEventListener("click", () => {

        $trailer.innerHTML = `
        
          <iframe width="400" height="315" src="${url}" title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        
        `;

      })
      
      $btnClose = d.querySelectorAll(".close");
      
      $btnClose.forEach(el => {
        el.addEventListener("click", () => {
          $movieDescC.classList.add("translate");
        });
      })

      $movieDescC.classList.remove("none");
      $movieDescC.classList.remove("translate");
      
    })
  })
  
}

const getMovieTrailer = async (id) => {

  try {

    let peticion = await fetch(`${DETAILS1}${id}${DETAILS2}`),
      json = await peticion.json();      

      const info = {
        genero: json.genres,
        url: "",
        tiempo: json.runtime
      }
          
    
      if(json.videos.results[0] !== undefined){

        info.url = `${YOUTUBE}${json.videos.results[0].key}`;

      }

    if(!peticion.ok) throw new Error("Ocurrio un error");

    return info

  } catch (error) {

    $slideTrailerC.textContent = error;

  }

}


d.addEventListener("DOMContentLoaded", async () => {
  
  let results = await getMovie(API_URL);

  saveMovie(results);
  
});

w.addEventListener("scroll", async () => {

  const {scrollTop, clientHeight, scrollHeight} = d.documentElement;  

  if(scrollTop + clientHeight >= scrollHeight){

    let results = await getMovie(URL_SCROLL+nextPage);

    saveMovie(results);

    nextPage += 1; 

  }  

})

$form.addEventListener("keyup", async e => {
  e.preventDefault();  
  let busqueda = $buscador.value;

  console.log(busqueda);

  $movieContainer.innerHTML = "";

  d.querySelector(".todas").classList.add("underline");
  d.querySelector(".mas-valoradas").style.textDecoration = "none";
  d.querySelector(".mas-valoradas").style.color = "#fffffe";
  d.querySelector(".menos-valoradas").style.textDecoration = "none";
  d.querySelector(".menos-valoradas").style.color = "#fffffe";
  d.querySelector("h1").textContent = "Todas las películas";

  if(busqueda !== ""){
    let resultado = await getMovie(SEARCH_URL + busqueda);
    
    if(resultado.length === 0){
      let text = `No se encontraron resultados para "${busqueda}"`;
      $notFound.classList.remove("none");
      $notFound.querySelector("p").textContent = text;
    }else{
      $notFound.classList.add("none");
    }
  }else{
    getMovie(API_URL);
  }
});

const masValoradas = async (pelis) => {

    let pelisOrdenadas = pelis.sort((a,b) => {

      if(a.vote_average > b.vote_average){

        return -1;

      }

    })
    
    showMovie(pelisOrdenadas);

}

const menosValoradas = async (pelis) => {  
          
    let pelisOrdenadas = pelis.sort((a,b) => {

      if(a.vote_average < b.vote_average){

        return -1;

      }

    })
    
    showMovie(pelisOrdenadas);

}

d.addEventListener("click", e => {

  if(e.target.matches(".mas-valoradas")){

    $movieContainer.innerHTML = "";

    d.querySelector(".todas").classList.remove("underline");
    d.querySelector(".menos-valoradas").style.textDecoration = "none";
    d.querySelector(".menos-valoradas").style.color = "#fffffe";
    d.querySelector("h1").textContent = "Películas más valoradas";

    e.target.style.textDecoration = "underline";
    e.target.style.color = "#fed941";

    masValoradas(pelis);

  }

  if (e.target.matches(".menos-valoradas")) {

    $movieContainer.innerHTML = "";

    d.querySelector(".todas").classList.remove("underline");
    d.querySelector(".mas-valoradas").style.textDecoration = "none";
    d.querySelector(".mas-valoradas").style.color = "#fffffe";
    d.querySelector("h1").textContent = "Películas menos valoradas";

    e.target.style.textDecoration = "underline";
    e.target.style.color = "#fed941";

    menosValoradas(pelis);    
    
  }

  if (e.target.matches(".todas")) {

    $movieContainer.innerHTML = "";

    d.querySelector(".todas").classList.add("underline");
    d.querySelector(".mas-valoradas").style.textDecoration = "none";
    d.querySelector(".mas-valoradas").style.color = "#fffffe";
    d.querySelector(".menos-valoradas").style.textDecoration = "none";
    d.querySelector(".menos-valoradas").style.color = "#fffffe";
    d.querySelector("h1").textContent = "Todas las películas";

    getMovie(API_URL);
    
  }

})