import {registerRoute} from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';

registerRoute(
  ({url}) => url.origin === 'https://api.exchangeratesapi.io/latest/' ||
              url.origin === 'https://api.binance.com/api/v3/',
  //If there is a Response in the cache, the Request will be fulfilled 
  // using the cached response and the network will not be used at all. 
  //If there isn't a cached response, the Request will be fulfilled by
  // a network request and the response will be cached so that the next request is served directly from the cache.
  new CacheFirst({
    cacheName: 'currency-exchange-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      })
    ]
  })
);