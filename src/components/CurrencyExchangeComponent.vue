<template>
    <div>
        <div class="content"> 
            <div class="currency-section">
                <h2 class="currency-heading">Currency I have</h2>
                <div class="currency-type ">
                    <input class="currency-type-input cursor-pointer"  type="radio" id="fiatFrom" value="fiat" checked="checked" v-model="fromCurrencyType">
                    <label for="fiatFrom" class="cursor-pointer">Fiat Currency</label>
                    <input class="currency-type-input cursor-pointer" type="radio" id="cryptoFrom" value="crypto" v-model="fromCurrencyType">
                    <label class="cursor-pointer" for="cryptoFrom">Crypto Currency</label>
                </div>
                <div class="currency-option">
                    <select class="currency-select" id="fromCurrencyNameId" v-model="fromCurrencyName">
                    <option disabled value="">---</option>
                    <option v-for="option in fromCurrencyOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                    </select>
                    <input id="from-currency-value" type="number" v-model="fromCurrencyValue">
                </div>
            </div>

            <div class="currency-convert">
                <div class="convert-button" v-on:click="convertCurrency">
                    <img width="100%" alt="convert" src="./../assets/convert.png"/>
                </div>
            </div>

            <div class="currency-section">
                <h2 class="currency-heading spacing-left">Currency I Want</h2>
                <div class="currency-type spacing-left">
                    <input class="currency-type-input cursor-pointer" type="radio" id="fiatTo" value="fiat" checked="checked" v-model="toCurrencyType">
                    <label class="cursor-pointer" for="fiatTo">Fiat Currency</label>
                    <input class="currency-type-input cursor-pointer" type="radio" id="cryptoTo" value="crypto" v-model="toCurrencyType">
                    <label class="cursor-pointer" for="cryptoTo">Crypto Currency</label>
                </div>
                
                <div class="currency-option spacing-left">
                    <select class="currency-select" id="toCurrencyNameId" v-model="toCurrencyName">
                    <option disabled value="">---</option>
                    <option v-for="option in toCurrencyOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                    </select>
                    <input id="to-currency-value" type="number" v-model="toCurrencyValue" :disabled=true>
                </div>
            
            </div>
        </div>
        <div v-if="errorMessage!=''" class="content error-bar">
           {{errorMessage}}
        </div>
    </div>
    
</template>

<script>

import apiService from './../apiService.js'


export default {
  name: 'CurrencyExchangeComponent',
  mixins: [apiService],
  components: {
  },
  data() {
    return {
      cryptoCurrencyOptions: [],
      fiatCurrencyOptions: [],
      fromCurrencyName: "",
      toCurrencyName: "",
      fromCurrencyType: "fiat",
      toCurrencyType: "fiat",
      fromCurrencyValue: 0,
      toCurrencyValue: 0,
      cryptoCurrencyList: [],
      errorMessage: ""
    }
  },
  computed: {
    fromCurrencyOptions: function() {
        if(this.fromCurrencyType == "fiat") {
            return this.fiatCurrencyOptions;
        } else {
            return this.cryptoCurrencyOptions;
        }
    },
    toCurrencyOptions: function() {
        if(this.toCurrencyType == "fiat") {
            return this.fiatCurrencyOptions;
        } else {
            return this.cryptoCurrencyOptions;
        }
    }
  },
  watch: {
      fromCurrencyType: function(updatedVal) {
          if(updatedVal != undefined){
              this.fromCurrencyName = "";
          }
      },
      toCurrencyType: function(updatedVal) {
          if(updatedVal != undefined){
              this.toCurrencyName = "";
          }
      }
  },
  created() {
    
    var fiatCurrencyListUrl = this.getFiatCurrencyListURL();
    var cryptoCurrencyListUrl = this.getCryptoCurrencyListURL();
    this.getCurrencyData(fiatCurrencyListUrl).then((data) => {
        this.fiatCurrencyOptions = Object.keys(data.rates);
        this.fiatCurrencyOptions.push(data.base);
    });
    this.getCurrencyData(cryptoCurrencyListUrl).then((data) => {
        var currencySymbols = data.symbols;
        currencySymbols.forEach(symbol => {
            this.cryptoCurrencyList.push({
                "symbol"    : symbol.symbol,
                "baseAsset" : symbol.baseAsset,
                "quoteAsset": symbol.quoteAsset
            });
            if(!this.cryptoCurrencyOptions.includes(symbol.baseAsset)) {
                this.cryptoCurrencyOptions.push(symbol.baseAsset);
            }
            if(!this.cryptoCurrencyOptions.includes(symbol.quoteAsset)) {
                this.cryptoCurrencyOptions.push(symbol.quoteAsset);
            }
        });
        
      });
    
  },
  methods: {
    convertCurrency: function() {
        if(this.fromCurrencyName!="" && this.toCurrencyName!="") {
            this.errorMessage = "";
            if(this.fromCurrencyType == "fiat") {
                if(this.toCurrencyType == "fiat") {
                    this.fiatToFiatCurrencyExchange(this.fromCurrencyName, this.toCurrencyName, this.fromCurrencyValue);
                } else {
                    this.fiatToCryptoCurrencyExchange(this.fromCurrencyName, this.toCurrencyName, this.fromCurrencyValue);
                }
            } else {
                if(this.toCurrencyType == "fiat") {
                    this.cryptoToFiatCurrencyExchangeRate(this.fromCurrencyName, this.toCurrencyName, this.fromCurrencyValue);
                } else {
                    this.cryptoToCryptoCurrencyExchangeRate(this.fromCurrencyName, this.toCurrencyName, this.fromCurrencyValue);
                }
            }
        } else {
            this.errorMessage = "Please Select Currencies";
        }
    },
    fiatToFiatCurrencyExchange: function(fromCurrency, toCurrency, fromCurrencyVal){
        var fiatCurrencyUrl = this.getFiatCurrencyExchangeRateURL(fromCurrency, toCurrency);
        this.getCurrencyData(fiatCurrencyUrl).then((data) => {
            this.toCurrencyValue = fromCurrencyVal * data.rates[toCurrency];
        }).catch(() => {
            this.errorMessage ="Exchange Rate not available for this currency";
        });
    },
    fiatToCryptoCurrencyExchange: function(fromCurrency, toCurrency, fromCurrencyVal){
        var intermediateCurrency = "EUR";
        var intermediateFiatCurrencyUrl = this.getFiatCurrencyExchangeRateURL(fromCurrency, intermediateCurrency);
        this.getCurrencyData(intermediateFiatCurrencyUrl).then((data) => {
            var intermediateExchangeVal = fromCurrencyVal * data.rates[intermediateCurrency];
            this.cryptoToCryptoCurrencyExchangeRate(intermediateCurrency, toCurrency, intermediateExchangeVal);
        }).catch(() => {
            this.errorMessage ="Exchange Rate not available for this currency";
        })
    },
    cryptoToCryptoCurrencyExchangeRate: function(fromCurrency, toCurrency, fromCurrencyVal){
        var [cond, symbol] = this.isCryptoToCryptoCurrencyExchangePossible(fromCurrency, toCurrency);
        if (cond != -1 ) {
            var cryptoCurrencyUrl = this.getCryptoCurrencyExchangeRateURL(symbol);
            this.getCurrencyData(cryptoCurrencyUrl).then((data) => {
            if(cond == 0) {
                this.toCurrencyValue = fromCurrencyVal * data.price;
            } else {
                this.toCurrencyValue = fromCurrencyVal / data.price;
            }
            }).catch(() => {
                this.errorMessage ="Exchange Rate not available for this currency";
            });
        } else {
            this.errorMessage ="Exchange Rate not available for this currency";
        }
    },
    cryptoToFiatCurrencyExchangeRate: function(fromCurrency, toCurrency, fromCurrencyVal){
        var intermediateCurrency = "EUR";
        var intermediateExchangeVal;
        var [cond, intermediateSymbol]= this.isCryptoToCryptoCurrencyExchangePossible(fromCurrency, intermediateCurrency);
        if (cond != -1 ) {
            var intermediateCryptoCurrencyUrl = this.getCryptoCurrencyExchangeRateURL(intermediateSymbol);
            this.getCurrencyData(intermediateCryptoCurrencyUrl).then((data) => {
            if(cond == 0) {
                intermediateExchangeVal = fromCurrencyVal * data.price;
                this.fiatToFiatCurrencyExchange(intermediateCurrency, toCurrency, intermediateExchangeVal);
            } else {
                intermediateExchangeVal = fromCurrencyVal / data.price;
                this.fiatToFiatCurrencyExchange(intermediateCurrency, toCurrency, intermediateExchangeVal);
            }
            }).catch(() => {
                this.errorMessage ="Exchange Rate not available for this currency";
            });
        } else {
            this.errorMessage ="Exchange Rate not available for this currency";
        }
    },
    isCryptoToCryptoCurrencyExchangePossible: function(fromCurrency, toCurrency){
        var symbol = fromCurrency + toCurrency;
        var cond = 0;
        if(!this.cryptoCurrencyList.some(symb => symb.symbol == symbol)){
            symbol = toCurrency + fromCurrency;
            if(this.cryptoCurrencyList.some(symb => symb.symbol == symbol)){
                cond = 1;
            } else {
                cond = -1;
            }

        }
        return [cond, symbol];
    }
  }
}
</script>

<style lang="scss">
    .content {
        display: flex;
        align-self: center;
        justify-content: space-around;
        width: 90%;
        margin: 2rem;
        padding: 1rem;
        box-shadow: 0 0 10px rgba(0,0,0,.1);
    
        .currency-section {
            display: flex;
            flex-direction: column;
            padding: 2%;
            flex-basis: 40%;
            .currency-type {
                padding: 0.5rem;

                .cursor-pointer {
                    cursor: pointer;
                }
            }

            .currency-option {
                padding: 0.5rem;
            }

            .currency-heading {
                padding: 0.5rem;
                color: #808080;
            }

            .spacing-left {
                padding-left: min(40% , calc(100% - 300px));
            }
        }

        .currency-select {
            height: 20px;
            width: 6.7rem;
            margin-right: 1rem;
            margin-bottom: 1rem;
        }

        .currency-convert {
            flex-basis: 6%;
            align-self:center;
            .convert-button {
                width: 100%;
                box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
                cursor:pointer;
                padding: 0.3rem;
            }
            .convert-button:active {
                box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
            }
        }

    }

    .error-bar {
        color: #D8000C;
        background-color: #FFBABA;
        border: 1px solid;
        background-repeat: no-repeat;
        background-position: 10px center;
    }

</style>
