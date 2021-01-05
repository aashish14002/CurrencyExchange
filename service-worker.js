import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

registerRoute(
  ({url}) => url.origin === 'https://api.exchangeratesapi.io/latest/' ,
  new CacheFirst({
    cacheName: 'fiat-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);