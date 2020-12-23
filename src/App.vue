<template>
  <div id="app" class="container">
    <div class="top-bar">
      <div class="logo">
        <img alt="Vue logo" src="./assets/logo.png">
      </div>
      <div class="title">
        Currency Exchange
      </div>
    </div>
    <div class="content">
      <div class="content-container">
        <div>
          <div class="from-currency-section">
            <label for="fromCurrencyName">From</label>
            <select id="fromCurrencyName" v-model="fromCurrencyName">
              <option v-for="option in currencyOptions" v-bind:key="option" v-bind:value="option">
                {{ option }}
              </option>
            </select>
            <label for="from-currency-value">Amount</label>
            <input id="from-currency-value" type="number" >
          </div>

          <div class="to-currency-section">
            <label for="toCurrencyName">From</label>
            <select id="toCurrencyName" v-model="toCurrencyName">
              <option v-for="option in currencyOptions" v-bind:key="option" v-bind:value="option">
                {{ option }}
              </option>
            </select>
            <label for="to-currency-value">Amount</label>
            <input id="to-currency-value" type="number" :disabled=true>
          </div>
        </div>
        <button>
          Convert
        </button>
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
      currencyOptions: ["A"],
      fromCurrencyName: "",
      toCurrencyName: "",
      fromCurrencyType: "",
      toCurrencyType: "",
      fromCurrencyValue: 0,
      toCurrencyValue: 0,
      
    }
  },
  mounted() {
    this.getAllFiatCurrency()
  },
  methods: {

  }
}
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
