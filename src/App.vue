<template>
  <div id="app" class="container">
    <div class="top-bar">
      <div class="logo-container">
        <img alt="Exchange Currency logo" class="logo" src="./assets/logo.png"/>
      </div>
      <div class="title">
        <h1>Currency Exchange</h1>
      </div>
    </div>
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
              <img width="100%" alt="convert" src="./assets/convert.png"/>
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
  </div>
</template>

<script>

import apiService from './apiService.js'


export default {
  name: 'App',
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
      cryptoCurrencyList: []
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
        if(this.fromCurrencyType == "fiat") {
          if(this.fromCurrencyType == "fiat") {
            this.fiatToFiatCurrencyExchange();
          } else {
            return;
          }
        } else {
          if(this.fromCurrencyType == "fiat") {
            return;
          } else {
            this.cryptoToCryptoCurrencyExchangeRate();
          }
        }
      }
    },
    fiatToFiatCurrencyExchange: function(){
      if(this.fromCurrencyName!="" && this.toCurrencyName!=""){
        var fiatCurrencyUrl = this.getFiatCurrencyExchangeRateURL(this.fromCurrencyName, this.toCurrencyName);
        this.getCurrencyData(fiatCurrencyUrl).then((data) => {
          this.toCurrencyValue = this.fromCurrencyValue * data.rates[this.toCurrencyName];
        })
      }
    },
    cryptoToCryptoCurrencyExchangeRate: function(){
      var symbol = this.fromCurrencyName + this.toCurrencyName;
      var cond = 0;
      if(!this.cryptoCurrencyList.some(symb => symb.symbol == symbol)){
        symbol = this.toCurrencyName + this.fromCurrencyName;
        if(this.cryptoCurrencyList.some(symb => symb.symbol == symbol)){
          cond = 1;
        } else {
          cond = -1;
        }

      }
      if (cond != -1 ) {
        var cryptoCurrencyUrl = this.getCryptoCurrencyExchangeRateURL(symbol);
        this.getCurrencyData(cryptoCurrencyUrl).then((data) => {
          if(cond == 0) {
            this.toCurrencyValue = this.fromCurrencyValue * data.price;
          } else {
            this.toCurrencyValue = this.fromCurrencyValue / data.price;
          }
        });
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2e4369;
  /* margin-top: 60px; */
}

.container {
  display: flex;
  flex-direction: column;
  /* padding-left: 1rem;
  padding-right: 1rem; */
  justify-content: space-between;
  
}

.top-bar {
  display: flex;
  flex-direction: row;
  height: 4rem;
  /* width: 100%; */
  transition: all 0.5s;
  align-items: center;
  background-color: #fff;
  /* padding-bottom: 2rem; */
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
}

.logo-container {
  align-self: center;
  padding-right: 1rem;
  max-height: 95%;
}

.logo {
  height: 60px;
}

.title {
  align-self: center;
  color: #00B685;
}

.content {
  display: flex;
  align-self: center;
  justify-content: space-around;
  width: 90%;
  margin: 2rem;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
}

.currency-section {
  display: flex;
  flex-direction: column;
  padding: 2%;
  flex-basis: 40%;
}

.currency-select {
  height: 20px;
  margin-right: 1rem;
}

.currency-convert {
  flex-basis: 6%;
  align-self:center;
}

.currency-type {
  padding: 0.5rem;
}

.currency-option {
  padding: 0.5rem;
}

.currency-heading {
  padding: 0.5rem;
  color: #808080;
}

.convert-button {
  width: 100%;
  box-shadow: 0 0 5px -1px rgba(0,0,0,0.2);
  cursor:pointer;
  padding: 0.3rem;
  
}

.convert-button:active {
  box-shadow: 0 0 5px -1px rgba(0,0,0,0.6);
}

.spacing-left {
  padding-left: 40%;
}

.cursor-pointer {
  cursor: pointer;
}

</style>
