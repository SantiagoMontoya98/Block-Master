const dd = document,  
  $slideDer = dd.querySelector(".slide-der"),
  $span1 = dd.querySelector(".unoS"),
  $span2 = dd.querySelector(".dosS"),
  $span3 = dd.querySelector(".tresS"),
  $sliderSlides = dd.querySelector(".slider-slides"),
  $slideTrailerC = dd.querySelector(".slide-trailer-container");
  API_URL_SLIDER = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=10',
  IMG_PATH_SLIDER = 'https://image.tmdb.org/t/p/w1280';

let index = 0,
  $slides,
  totalSlides;  

$span1.style.backgroundColor = "white";

const getMovieSlider = async (url) => {
  try {
    let peticion = await fetch(url),
      json = await peticion.json(),
      {results} = json;
          
    showMovieSlider(results);

    if(!peticion.ok) throw new Error("Ocurrio un error");

    return results;

  } catch (error) {
    $sliderSlides.textContent = error;
  }

}

const showMovieSlider = (movie) => {

  $sliderSlides.innerHTML = "";

  let idArray = [];

  for (let index = 0; index < 3; index++) {

    const backdrop_path = movie[index].backdrop_path;

    idArray.push(movie[index].id);
    
    $sliderSlides.innerHTML += `
    
      <div class="slider-slide active">
          <img src="${IMG_PATH_SLIDER + backdrop_path}">
          <article class="ver">
            <button class="ahora trailerSlide"><img src="./images/flecha.png" alt="flecha">VER AHORA</button>
            <button class="despues"><img src="./images/suma.png" alt="suma">VER DESPUÉS</button>
          </article>
      </div>
    
    
    `;
    
  }  

  $slides = dd.querySelector(".slider-slides").children;
  totalSlides = $slides.length;  

  const $verTrailer = dd.querySelectorAll(".trailerSlide");

  $verTrailer.forEach((el,index) => {

    el.addEventListener("click", async () => {

      const url = await getSlideTrailer(idArray[index]);      

      $slideTrailerC.classList.remove("translate");

      $slideTrailerC.innerHTML = `
      
      
        <iframe src="${url}" title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>

        <span class="closeTrailer">X</span>
      
      `;

      const $closeTrailer = dd.querySelector(".closeTrailer");

      $closeTrailer.addEventListener("click", () => $slideTrailerC.classList.add("translate"));

    })

  })

  

  /* $closeTrailer.addEventListener("click", () => $slideTrailerC.classList.add("translate")); */


  //console.log($verTrailer);

  $slides[1].classList.remove("active");
  $slides[2].classList.remove("active");

  $slides[1].classList.add("dos");

  $slides[1].querySelector(".ver").style.display = "none";
  
}

const getSlideTrailer = async (id) => {

  try {

    let peticion = await fetch(`${DETAILS1}${id}${DETAILS2}`),
      json = await peticion.json();
          
    
      if(json.videos.results[0] !== undefined){

        const url = `${YOUTUBE}${json.videos.results[0].key}`;

        return url;

      }

    if(!peticion.ok) throw new Error("Ocurrio un error");    

  } catch (error) {

    $slideTrailerC.textContent = error;

  }

}

dd.addEventListener("DOMContentLoaded", () => {

  getMovieSlider(API_URL_SLIDER);
  
});

const mover = (direccion) => {

  if (direccion == "siguiente") {

    index++;

    if (index == totalSlides) {

      index = 0;

    }
  }else
    {      
      if (index == 0) {

        index = totalSlides - 1;

      } else {

        index--;

      }
  }

  for (i = 0; i < $slides.length; i++) $slides[i].classList.remove("active");  

  $slides[index].classList.add("active");
  $slides[index].classList.remove("dos");
  
}

dd.addEventListener("click", e => {

  if(e.target.matches(".slide-der")){

    mover("siguiente");

    //console.log(index);

    if(index !== 2){

      $slides[index+1].classList.add("dos");
      $slides[index].style.transform = "translate(0,-110px)";

    }else{

      $slides[0].classList.add("dos");
      $slides[index].style.transform = "translate(0,-110px)";

    }

    if(index == 0){

      $span1.style.backgroundColor = "white";
      $span2.style.backgroundColor = "#a7a9be";
      $span3.style.backgroundColor = "#a7a9be";

      $slides[index].querySelector(".ver").style = "";

      $slides[index+1].querySelector(".ver").style.display = "none";

    }

    if(index == 1){

      $slides[2].removeAttribute("style");
      $slides[0].removeAttribute("style");

      $slides[1].querySelector(".ver").removeAttribute("style");

      $span2.style.backgroundColor = "white";
      $span1.style.backgroundColor = "#a7a9be";
      $span3.style.backgroundColor = "#a7a9be";

      $slides[index+1].querySelector(".ver").style.display = "none";

    }

    if(index == 2){

      $slides[index - 1].removeAttribute("style");
      $slides[0].classList.add("dos");

      $span3.style.backgroundColor = "white";
      $span2.style.backgroundColor = "#a7a9be";
      $span1.style.backgroundColor = "#a7a9be";

      $slides[index].querySelector(".ver").style = "";

      $slides[0].querySelector(".ver").style.display = "none";

    }

  }

})