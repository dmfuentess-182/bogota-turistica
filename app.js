// ==========================================
// 1. DEFINICION DE CLASES (MODELO POO)
// ==========================================

// Clase Base
class LugarTuristico {
    #visitas = 0;

    constructor(id, nombre, direccion, epoca, imagen, descripcion, visitasIniciales = 0) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.epoca = epoca;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.#visitas = visitasIniciales;
    }

    obtenerVisitas() {
        return this.#visitas;
    }

    sumarVisita() {
        this.#visitas++;
    }

    // Convierte la instancia a objeto plano para guardarlo en IndexedDB
    aObjetoPlano() {
        return {
            id: this.id,
            tipo: "turistico",
            nombre: this.nombre,
            direccion: this.direccion,
            epoca: this.epoca,
            imagen: this.imagen,
            descripcion: this.descripcion,
            visitas: this.#visitas
        };
    }

    // Tarjeta normal en la cuadricula
    crearTarjetaHTML() {
        return `
            <article class="tarjeta-lugar">
                <img src="${this.imagen}" 
                     alt="${this.nombre}" 
                     class="imagen-lugar" 
                     width="400" 
                     height="160" 
                     loading="lazy">
                <div class="contenido-tarjeta">
                    <span class="categoria">Lugar Turistico</span>
                    <h3>${this.nombre}</h3>
                    <p>Direccion: ${this.direccion}</p>
                    <p>Epoca: ${this.epoca}</p>
                    <p>Visitas registradas: <strong id="visitas-${this.id}">${this.#visitas}</strong></p>
                    <button class="btn-ver-mas" data-id="${this.id}">Ver más</button>
                </div>
            </article>
        `;
    }

    // Tarjeta ampliada para la ventana modal
    crearDetalleHTML() {
        return `
            <div class="modal-contenido">
                <button class="btn-cerrar" id="btn-cerrar-detalle">&times;</button>
                <img src="${this.imagen}" alt="${this.nombre}" class="imagen-detalle">
                <div class="info-detalle">
                    <span class="categoria">Lugar Turistico</span>
                    <h2>${this.nombre}</h2>
                    <p class="detalle-direccion"> <strong>Direccion:</strong> ${this.direccion}</p>
                    <p class="detalle-epoca"> <strong>Epoca:</strong> ${this.epoca}</p>
                    <p class="detalle-visitas"> <strong>Visitas totales:</strong> ${this.#visitas}</p>
                    <div class="bloque-descripcion">
                        <h4>Descripcion:</h4>
                        <p>${this.descripcion}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Clase Derivada (Herencia y Polimorfismo)
class LugarHistorico extends LugarTuristico {
    constructor(id, nombre, direccion, epoca, imagen, descripcion, visitasIniciales = 0) {
        super(id, nombre, direccion, epoca, imagen, descripcion, visitasIniciales);
    }

    aObjetoPlano() {
        const base = super.aObjetoPlano();
        base.tipo = "historico";
        return base;
    }

    // Polimorfismo: cambia la insignia a "Lugar Historico"
    crearTarjetaHTML() {
        return `
            <article class="tarjeta-lugar historico">
                <img src="${this.imagen}" 
                     alt="${this.nombre}" 
                     class="imagen-lugar" 
                     width="400" 
                     height="160" 
                     loading="lazy">
                <div class="contenido-tarjeta">
                    <span class="categoria">Lugar Historico</span>
                    <h3>${this.nombre}</h3>
                    <p>Direccion: ${this.direccion}</p>
                    <p>Epoca: ${this.epoca}</p>
                    <p>Visitas registradas: <strong id="visitas-${this.id}">${this.obtenerVisitas()}</strong></p>
                    <button class="btn-ver-mas" data-id="${this.id}">Ver más</button>
                </div>
            </article>
        `;
    }

    // Polimorfismo: modal con estilo historico
    crearDetalleHTML() {
        return `
            <div class="modal-contenido historico">
                <button class="btn-cerrar" id="btn-cerrar-detalle">&times;</button>
                <img src="${this.imagen}" alt="${this.nombre}" class="imagen-detalle">
                <div class="info-detalle">
                    <span class="categoria">Lugar Historico</span>
                    <h2>${this.nombre}</h2>
                    <p class="detalle-direccion"> <strong>Direccion:</strong> ${this.direccion}</p>
                    <p class="detalle-epoca"> <strong>Epoca:</strong> ${this.epoca}</p>
                    <p class="detalle-visitas"> <strong>Visitas totales:</strong> ${this.obtenerVisitas()}</p>
                    <div class="bloque-descripcion">
                        <h4>Descripcion:</h4>
                        <p>${this.descripcion}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// ==========================================
// 2. DATOS INICIALES (INSTANCIAS POO)
// ==========================================

const lugaresIniciales = [
    new LugarTuristico(
        1,
        "Monserrate", 
        "Cerro Oriental", 
        "Siglo XVII / Colonial", 
        "images/monserrate-ia.png",
        "El Cerro de Monserrate es el simbolo por excelencia de Bogota. Ubicado a 3.152 metros sobre el nivel del mar, ofrece una vista panoramica completa de la capital y alberga el Santuario del Senor Caido, frecuentado por peregrinos y turistas de todo el mundo."
    ),
    new LugarHistorico(
        2,
        "Museo Casa Quinta de Bolivar", 
        "Centro de Bogota", 
        "Siglo XIX / Republicana", 
        "images/casaBolivar.png",
        "Hermosa casa colonial campestre que sirvio como residencia del Libertador Simon Bolivar en Bogota durante varios periodos entre 1820 y 1830. Conserva jardines historicos, canones de la independencia y mobiliario original de la epoca republicana."
    ),
    new LugarHistorico(
        3,
        "Museo Historico de la Policia", 
        "La Candelaria", 
        "Inicios del Siglo XX", 
        "images/fachada_museo.png",
        "Ubicado en una joya arquitectonica de estilo republicano frances en el barrio La Candelaria. Exhibe la evolucion institucional, armamento historico, uniformes, vehiculos antiguos y piezas clave de la historia de la seguridad en Colombia."
    )
];

let listaLugares = [...lugaresIniciales];
let db = null;

// ==========================================
// 3. BASE DE DATOS LOCAL (INDEXEDDB)
// ==========================================

function iniciarBaseDatos() {
    const solicitud = indexedDB.open("BogotaExplorando", 2);

    solicitud.onupgradeneeded = (event) => {
        const baseDatos = event.target.result;
        if (!baseDatos.objectStoreNames.contains("lugares")) {
            baseDatos.createObjectStore("lugares", { keyPath: "id" });
            console.log("Base de datos IndexedDB creada");
        }
    };

    solicitud.onsuccess = (event) => {
        db = event.target.result;
        console.log("IndexedDB conectada correctamente");
        cargarDesdeIndexedDB();
    };

    solicitud.onerror = () => {
        console.warn("No se pudo abrir IndexedDB, usando datos en memoria.");
        mostrarLugares(listaLugares);
    };
}

function cargarDesdeIndexedDB() {
    const transaccion = db.transaction("lugares", "readwrite");
    const almacen = transaccion.objectStore("lugares");
    const solicitudLectura = almacen.getAll();

    solicitudLectura.onsuccess = () => {
        const registros = solicitudLectura.result;

        if (registros.length === 0) {
            // Primera vez: guardamos las instancias iniciales en IndexedDB
            lugaresIniciales.forEach((lugar) => {
                almacen.put(lugar.aObjetoPlano());
            });
            listaLugares = [...lugaresIniciales];
        } else {
            // Reconstruimos los objetos como instancias reales de nuestras clases POO
            listaLugares = registros.map((dato) => {
                if (dato.tipo === "historico") {
                    return new LugarHistorico(
                        dato.id, dato.nombre, dato.direccion, dato.epoca,
                        dato.imagen, dato.descripcion, dato.visitas
                    );
                }
                return new LugarTuristico(
                    dato.id, dato.nombre, dato.direccion, dato.epoca,
                    dato.imagen, dato.descripcion, dato.visitas
                );
            });
        }

        mostrarLugares(listaLugares);
    };
}

function actualizarVisitaEnIndexedDB(lugar) {
    if (!db) return;
    const transaccion = db.transaction("lugares", "readwrite");
    const almacen = transaccion.objectStore("lugares");
    almacen.put(lugar.aObjetoPlano());
}

// ==========================================
// 4. MOSTRAR EN PANTALLA Y EVENTOS
// ==========================================

const contenedorLugares = document.getElementById("lugares");
const contenedorDetalle = document.getElementById("detalle");
const inputBusqueda = document.getElementById("campo-busqueda");

function mostrarLugares(lugaresParaMostrar) {
    contenedorLugares.innerHTML = "";

    if (lugaresParaMostrar.length === 0) {
        contenedorLugares.innerHTML = "<p>No se encontraron lugares turisticos.</p>";
        return;
    }

    lugaresParaMostrar.forEach((lugar) => {
        contenedorLugares.innerHTML += lugar.crearTarjetaHTML();
    });

    asignarEventosBotones();
}

function asignarEventosBotones() {
    const botones = document.querySelectorAll(".btn-ver-mas");
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const id = Number(e.target.getAttribute("data-id"));
            abrirDetalle(id);
        });
    });
}

function abrirDetalle(id) {
    const lugar = listaLugares.find(item => item.id === id);
    if (!lugar) return;
    
    // Suma la visita en el objeto encapsulado y la persiste en IndexedDB
    lugar.sumarVisita();
    actualizarVisitaEnIndexedDB(lugar);

    // Actualiza el contador en la tarjeta que esta de fondo
    const contadorTexto = document.getElementById(`visitas-${id}`);
    if (contadorTexto) {
        contadorTexto.textContent = lugar.obtenerVisitas();
    }

    // Inyecta el modal y lo hace visible
    contenedorDetalle.innerHTML = lugar.crearDetalleHTML();
    contenedorDetalle.classList.add("activo");

    document.getElementById("btn-cerrar-detalle").addEventListener("click", cerrarDetalle);
}

function cerrarDetalle() {
    contenedorDetalle.classList.remove("activo");
    contenedorDetalle.innerHTML = "";
}

contenedorDetalle.addEventListener("click", (e) => {
    if (e.target === contenedorDetalle) {
        cerrarDetalle();
    }
});

inputBusqueda.addEventListener("input", (evento) => {
    const texto = evento.target.value.toLowerCase().trim();

    const resultados = listaLugares.filter(lugar => {
        const coincideNombre = lugar.nombre.toLowerCase().includes(texto);
        const coincideDireccion = lugar.direccion.toLowerCase().includes(texto);
        const coincideEpoca = lugar.epoca.toLowerCase().includes(texto);
        return coincideNombre || coincideDireccion || coincideEpoca;
    });

    mostrarLugares(resultados);
});

document.addEventListener("DOMContentLoaded", () => {
    iniciarBaseDatos();
});

// ==========================================
// 5. REGISTRO DEL SERVICE WORKER (PWA)
// ==========================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then((registro) => {
        console.log("Service Worker registrado con exito:", registro.scope);
      })
      .catch((error) => {
        console.log("Fallo el registro del Service Worker:", error);
      });
  });
}