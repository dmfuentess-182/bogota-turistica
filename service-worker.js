const CACHE_NAME = "bogota-explorando-v4";

const RECURSOS_A_CACHEAR = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/logo%20bogota%20explorando%20(192).png",
  "./icons/logo%20bogota%20explorando.png",
  "./images/monserrate-ia.png",
  "./images/casaBolivar.png",
  "./images/fachada_museo.png",
  "./icons/logo%20ut%20acredit.png"
];

// 1. Instalacion guardando recurso por recurso
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const recurso of RECURSOS_A_CACHEAR) {
        try {
          await cache.add(recurso);
        } catch (error) {
          console.warn("No se pudo cachear el archivo:", recurso);
        }
      }
    })
  );
  self.skipWaiting();
});

// 2. Activacion y purga de versiones anteriores
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) => {
      return Promise.all(
        claves.map((clave) => {
          if (clave !== CACHE_NAME) {
            return caches.delete(clave);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Estrategia Cache First con respaldo de red
self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respuestaCache) => {
      return respuestaCache || fetch(evento.request);
    })
  );
});

// 4. Notificaciones Push
self.addEventListener("push", (evento) => {
  self.registration.showNotification(
    "Bogotá Explorando",
    {
      body: "Hay nuevos lugares turísticos para explorar."
    }
  );
});