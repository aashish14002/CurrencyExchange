# Currency Exchange

Application to convert fiat and crypto currencies. Just enter select the currencies, enter an amount and get it converted to the selected currency.
Link to the application - https://aashish14002.github.io/CurrencyExchange/

## For fiat currencies
api: https://exchangeratesapi.io/.

## For crypto-currencies
api: https://api.binance.com/api/v3/ticker/price (documentation here: https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#symbol-price-ticker)

# Directory Structure
```
── ...
├── src                   
│   ├── assets                                  # Stores icons, logos, scss files
|   |   ├── scss
|   |   |   └──_variables.scss                  # For global variables for colors, etc.
|   |   └── ...            
│   ├── components 
|   |   ├── BaseCurrencyInput.vue               # Component for currency inputs
|   |   └── TheCurrencyExchangeComponent.vue    # Base Component for currency exchange form
│   ├── apiService.js                           # Contains function to get urls and send get request
│   ├── App.vue                                 # Main Component for app
│   ├── config.js                               # Stores all constants
│   ├── main.js                                 # Registes and renders the vue app
│   └── registerServiceWorker.js                
├──serviceWorker.js                             # Execute cache strategy 
└── ...
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


