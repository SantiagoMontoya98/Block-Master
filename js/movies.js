const d = document,
  $form = d.forms[0],
  url = "http://localhost:4001/movies";

let idMovie= 0;

const capturarDatos = () => {

  const $titulo = $form.titulo.value,
    $genero = $form.genero.value,
    $fecha = $form.fecha.value,
    $duracion = $form.duracion.value,
    $descripcion = $form.descripcion.value;

  const movie = {
    titulo: $titulo,
    genero: $genero,
    fechaLanzamiento: $fecha,
    duracion: $duracion,
    descripcion: $descripcion
  }

  return movie;
}

const estilosOK = () => {

  $form.querySelector(".validaciones").style.backgroundColor = "green";
  $form.querySelector(".validaciones").style.opacity = "1";

}

const estilosError = () => {

  $form.querySelector(".validaciones").style.backgroundColor = "rgb(255, 0, 0, 0.8)";
  $form.querySelector(".validaciones").style.opacity = "1";

}

d.addEventListener("click", async e => {  

  if(e.target.matches("#buscar")){

    const $titulo = $form.titulo.value;   

    let peticion = await fetch(url),
      data = await peticion.json();

    let movie = data.find(user => user.titulo.toLowerCase() === $titulo.toLowerCase());

    if(movie !== undefined){

      $form.titulo.disabled = true;

      let {id, titulo, genero, fechaLanzamiento, duracion, descripcion} = movie;

      idMovie = id;

      $form.titulo.value = titulo;
      $form.genero.value = genero;
      $form.fecha.value = fechaLanzamiento;
      $form.duracion.value = duracion;
      $form.descripcion.value = descripcion;

      $form.querySelector(".validaciones").style.opacity = "0";
      $form.querySelector(".validaciones").textContent = "";

    }else{

      $form.querySelector(".validaciones").textContent = "Película no encontrada";
      estilosError();

    } 

  }

  if(e.target.matches("#actualizar")){

    let expGenero = new RegExp($form.genero.pattern);

    if(!expGenero.exec($form.genero.value)){

      $form.querySelector(".validaciones").textContent = $form.genero.title;
      estilosError();

    }else if($form.fecha.value === ""){
      
      $form.querySelector(".validaciones").textContent = "Ingresa la fecha de lanzamiento";
      estilosError();

    }else if($form.duracion.value === ""){

      $form.querySelector(".validaciones").textContent = "Ingresa la duración";
      estilosError();

    }else if($form.descripcion.value === ""){

      $form.querySelector(".validaciones").textContent = "Ingresa la descripción";
      estilosError();

    }else{

      let {titulo, genero, fechaLanzamiento, duracion, descripcion} = capturarDatos();

      $form.querySelector(".validaciones").textContent = "Película actualizada";
      estilosOK();

      await fetch(`${url}/${idMovie}`, {
        method: "PUT",
        body: JSON.stringify({
          titulo,
          genero,
          fechaLanzamiento,
          duracion,
          descripcion
        }),
        headers: {
          "Content-Type": "application/json; charset = UTF-8"
        }    
      })

    }

    
  }

  if(e.target.matches("#eliminar")){

    if($form.titulo.value === ""){

      $form.querySelector(".validaciones").textContent = "Debes buscar por título para poder eliminar";
      estilosError();

    }else{

      $form.querySelector(".validaciones").textContent = "Película eliminada";
      estilosOK();

      await fetch(`${url}/${idMovie}`, {
        method: "DELETE"
      })

    }

  }

})

$form.addEventListener("submit", async e => {

  e.preventDefault();

  $form.querySelector(".validaciones").textContent = "Película creada";
  estilosOK();

  let {titulo, genero, fechaLanzamiento, duracion, descripcion} = capturarDatos();   

    await fetch(url,{
      method: "POST",
      body: JSON.stringify({
        titulo,
        genero,
        fechaLanzamiento,
        duracion,
        descripcion
      }),
      headers: {
        "Content-Type": "application/json; charset = UTF-8"
      }
    });

})