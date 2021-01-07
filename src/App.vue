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
    <currency-exchange-component></currency-exchange-component>
  </div>
</template>

<script>

import apiService from './apiService.js'
import CurrencyExchangeComponent from "@/components/CurrencyExchangeComponent.vue";

export default {
  name: 'App',
  mixins: [apiService],
  components: {
    CurrencyExchangeComponent
  },
  data() {
    return {
    
    }
  }
}
</script>

<style lang="scss">

.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2e4369;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .top-bar {
    display: flex;
    flex-direction: row;
    height: 4rem;
    transition: all 0.5s;
    align-items: center;
    background-color: #fff;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0,0,0,.1);

    .logo-container {
      align-self: center;
      padding-right: 1rem;
      max-height: 95%;
      .logo {
        height: 60px;
      }
    }

    .title {
      align-self: center;
      color: #00B685;
    }
  }
  
}
</style>
