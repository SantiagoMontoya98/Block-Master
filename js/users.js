const d = document,
  $form = d.forms[0],
  url = "http://localhost:4000/users";

let idUsuario = 0;

const capturarDatos = () => {

  const $nombre = $form.nombre.value,
    $apellido = $form.apellido.value,
    $nombreUsuario = $form.nombreUsuario.value,
    $correo = $form.correo.value,
    $contraseña = $form.contraseña.value;

  const usuario = {
    nombre: $nombre,
    apellido: $apellido,
    correo: $correo,
    nombreUsuario: $nombreUsuario,
    contraseña: $contraseña
  }

  return usuario;
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

    e.preventDefault();

    const $email = $form.correo.value;

    let peticion = await fetch(url),
      data = await peticion.json();

    let usuario = data.find(user => user.correo === $email);
    
    if(usuario !== undefined){

      $form.correo.disabled = true;

      let {id, nombre, apellido, correo, nombreUsuario, contraseña} = usuario;

      idUsuario = id;

      $form.nombre.value = nombre;
      $form.apellido.value = apellido;
      $form.correo.value = correo;
      $form.nombreUsuario.value = nombreUsuario;
      $form.contraseña.value = contraseña;

      $form.querySelector(".validaciones").style.opacity = "0";
      $form.querySelector(".validaciones").textContent = "";

    }else{

      $form.querySelector(".validaciones").textContent = "Correo no encontrado";
      estilosError();

    }

  }

  if(e.target.matches("#actualizar")){

    e.preventDefault();

    let expNombre = new RegExp($form.nombre.pattern),
      expApellido = new RegExp($form.nombre.pattern);

    if(!expNombre.exec($form.nombre.value)){

      $form.querySelector(".validaciones").textContent = $form.nombre.title;
      estilosError();
      
    }else if(!expApellido.exec($form.apellido.value)){

      $form.querySelector(".validaciones").textContent = $form.apellido.title;
      estilosError();

    }else if($form.nombreUsuario.value === ""){
      
      $form.querySelector(".validaciones").textContent = $form.nombreUsuario.title;
      estilosError();

    }else if($form.contraseña.value === ""){

      $form.querySelector(".validaciones").textContent = $form.contraseña.title;
      estilosError();

    }else{

      let {nombre, apellido, correo, nombreUsuario, contraseña} = capturarDatos();

      $form.querySelector(".validaciones").textContent = "Usuario actualizado";
      estilosOK();

      await fetch(`${url}/${idUsuario}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre,
          apellido,
          correo,
          nombreUsuario,
          contraseña
        }),
        headers: {
          "Content-Type": "application/json; charset = UTF-8"
        }    
      })

    }
    
  }
})

$form.addEventListener("submit", async e => {

  e.preventDefault();

  $form.querySelector(".validaciones").textContent = "Usuario creado";
  estilosOK();

  let {nombre, apellido, correo, nombreUsuario, contraseña} = capturarDatos();
    
  correo = correo.toLowerCase();

  await fetch(url,{
    method: "POST",
    body: JSON.stringify({
      nombre,
      apellido,
      correo,
      nombreUsuario,
      contraseña
    }),
    headers: {
      "Content-Type": "application/json; charset = UTF-8"
    }
  });
    
})