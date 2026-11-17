
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

    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Agrupar las publicaciones por unidad
    const grupos = {};

    entradas.forEach(entrada => {

      // Si alguna entrada no tiene unidad,
      // se coloca en una carpeta general.
      const unidad = entrada.unidad || "General";

      if (!grupos[unidad]) {
        grupos[unidad] = [];
      }

      grupos[unidad].push(entrada);
    });

    // Orden de las carpetas
    const unidades = Object.keys(grupos).sort(
      (a, b) => a.localeCompare(b, "es", {
        numeric: true
      })
    );

    // Orden de los tipos de materiales
    const ordenTipos = {
      "Teoría": 1,
      "Simulador": 2,
      "Práctica": 3
    };

    unidades.forEach((unidad, indice) => {

      const publicaciones = grupos[unidad];

      // Ordenar dentro de cada unidad
      publicaciones.sort((a, b) => {

        const tipoA = ordenTipos[a.tipo] || 99;
        const tipoB = ordenTipos[b.tipo] || 99;

        if (tipoA !== tipoB) {
          return tipoA - tipoB;
        }

        return a.titulo.localeCompare(
          b.titulo, "es", { numeric: true }
        );
      });

      // Crear carpeta desplegable
      const bloque = document.createElement("details");

      // Abrir la primera carpeta inicialmente
      bloque.open = indice === 0;

      const cabecera = document.createElement("summary");

      cabecera.textContent =
        "📁 " + unidad + " (" +
        publicaciones.length +
        (publicaciones.length === 1
          ? " recurso)"
          : " recursos)");

      bloque.appendChild(cabecera);

      const lista = document.createElement("ul");

      publicaciones.forEach(entrada => {

        const elemento = document.createElement("li");
        const enlace = document.createElement("a");

        // Icono según el tipo de recurso
        let icono = "📄";

        if (entrada.tipo === "Teoría") {
          icono = "📖";
        } else if (entrada.tipo === "Simulador") {
          icono = "💻";
        } else if (entrada.tipo === "Práctica") {
          icono = "📝";
        }

        enlace.href = entrada.url;
        enlace.textContent =
          icono + " " + entrada.titulo;

        elemento.appendChild(enlace);

        // Mostrar descripción debajo del enlace
        if (entrada.descripcion) {
          const descripcion = document.createElement("p");
          descripcion.textContent = entrada.descripcion;
          descripcion.style.fontSize = "0.9em";
          descripcion.style.color = "#666";
          descripcion.style.margin = "4px 0 12px 0";

          elemento.appendChild(descripcion);
        }

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
