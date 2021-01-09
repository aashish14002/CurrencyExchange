<template>
  <div
    id="app"
    class="container"
  >
    <div class="top-bar">
      <div class="logo-container">
        <img
          alt="Exchange Currency logo"
          class="logo"
          src="./assets/logo.png"
        />
      </div>
      <div class="title">
        <h1>Currency Exchange</h1>
      </div>
    </div>

    <the-currency-exchange-component></the-currency-exchange-component>
  </div>
</template>

<script>

import apiService from './apiService.js'
import TheCurrencyExchangeComponent from "@/components/TheCurrencyExchangeComponent.vue";

export default {
  name: 'App',
  mixins: [apiService],
  components: {
    TheCurrencyExchangeComponent
  },
  data() {
    return {
    
    }
  }
}
</script>

<style lang="scss">

@import "./assets/scss/_variables.scss";

.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $base-color;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  .top-bar {
    display: flex;
    flex-direction: row;
    height: 4rem;
    width: 100%;
    transition: all 0.5s;
    align-items: center;
    background-color: $background-color;
    padding: 1rem;
    box-shadow: 0 0 0.7rem rgba(0,0,0,.1);

    .logo-container {
      align-self: center;
      padding-right: 1rem;
      max-height: 95%;
      .logo {
        height: 4rem;
      }
    }

    .title {
      align-self: center;
      color: $primary-color;
    }
  }
  
}
</style>
