module.exports = {
  pwa: {
    name: 'Currency Exchange',
    themeColor: '#00B685',
    msTileColor: '#000000',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'serviceWorker.js',
    }
  }
}
