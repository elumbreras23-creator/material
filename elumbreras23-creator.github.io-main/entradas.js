
fetch("entradas.json")
  .then(respuesta => {
    if (!respuesta.ok) {
      throw new Error("No se pudo cargar entradas.json");
    }
    return respuesta.json();
  })
  .then(entradas => {
    const contenedor =
      document.getElementById("lista-publicaciones");

    contenedor.innerHTML = "";

    // Ordenar por fecha y hora descendente
    entradas.sort((a, b) =>
      b.fecha.localeCompare(a.fecha)
    );

    // Agrupar las entradas por fecha
    const grupos = {};

    entradas.forEach(entrada => {
      const dia = entrada.fecha.substring(0, 10);

      if (!grupos[dia]) {
        grupos[dia] = [];
      }

      grupos[dia].push(entrada);
    });

    // Crear un bloque desplegable por día
    Object.entries(grupos).forEach(([dia, publicaciones], indice) => {

      const bloque = document.createElement("details");
      bloque.open = indice === 0; // Día más reciente abierto

      const cabecera = document.createElement("summary");

      const fechaLegible = new Date(
        dia + "T12:00:00"
      ).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      cabecera.textContent =
        fechaLegible + " (" + publicaciones.length +
        (publicaciones.length === 1 ? " entrada)" : " entradas)");

      bloque.appendChild(cabecera);

      const lista = document.createElement("ul");

      publicaciones.forEach(entrada => {
        const elemento = document.createElement("li");
        const enlace = document.createElement("a");

        const hora = entrada.fecha.includes("T")
          ? entrada.fecha.substring(11, 16) + " - "
          : "";

        enlace.href = entrada.url;
        enlace.textContent = hora + entrada.titulo;

        elemento.appendChild(enlace);
        lista.appendChild(elemento);
      });

      bloque.appendChild(lista);
      contenedor.appendChild(bloque);
    });
  })
  .catch(error => {
    console.error(error);
    const contenedor =
      document.getElementById("lista-publicaciones");

    if (contenedor) {
      contenedor.textContent =
        "No se pudieron cargar las publicaciones.";
    }
  });

