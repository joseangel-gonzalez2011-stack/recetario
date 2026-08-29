const CACHE = 'recetario-v5';
const BOTELLAS = ['tanqueray','campari','martiniRosso','cuervo','cointreau','bacardi','aperol','prosecco','bourbon','licor43',
  'd-negroni','d-margarita','d-mojito','d-aperol','d-gintonic','d-paloma','d-cubalibre','d-whiskysour','d-carajillo'];
const FILES = ['.', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png',
  ...BOTELLAS.map(n => 'botellas/' + n + '.jpg')];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
