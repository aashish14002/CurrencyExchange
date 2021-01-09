<template>
    <div>
        <div class="content"> 
            
            <base-currency-input
                :heading="fromCurrencyLabel"
                :currency-type-label0="fiatCurrencyTypeLabel"
                :currency-type-label1="cryptoCurrencyTypeLabel"
                :currency-options="currencyOptions"
                :isDisabledCurrencyValue="false"
                @on-currency-input-change="onFromCurrencyInputChange"
                @on-currency-name-change="onFromCurrencyNameChange"
                @on-currency-value-change="onFromCurrencyValueChange" 
            />

            <div class="currency-convert">
                <div
                    class="convert-button"
                    @click="convertCurrency"
                >
                    <img
                        width="100%"
                        alt="convert"
                        src="./../assets/convert.png"
                    >
                </div>
            </div>

            <base-currency-input
                :heading="toCurrencyLabel"
                :currency-type-label0="fiatCurrencyTypeLabel"
                :currency-type-label1="cryptoCurrencyTypeLabel"
                :currency-options="currencyOptions"
                :isDisabledCurrencyValue="true"
                @on-currency-input-change="onToCurrencyInputChange"
                @on-currency-name-change="onToCurrencyNameChange"
                :val="toCurrencyValue"
            />

        </div>

        <div 
            v-if="errorMessage!=''"
            class="content error-bar"
        >
           {{errorMessage}}
        </div>

    </div>
    
</template>

<script>

import apiService from './../apiService.js'
import BaseCurrencyInput from "./BaseCurrencyInput.vue";

const EXCHANGE_NOT_AVAILABLE_ERR = "Exchange Rate not available for this currency";
const SELECT_CURRENCY_MSG = "Please Select Currencies!";

export default {
    name: 'CurrencyExchangeComponent',
    mixins: [apiService],
    components: {
        BaseCurrencyInput
    },
    data() {
        return {
            fromCurrencyLabel: "Currency I Have",
            toCurrencyLabel: "Cuurency I Want",
            fiatCurrencyTypeLabel: "Fiat Currency",
            cryptoCurrencyTypeLabel: "Crypto Currency",
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
        currencyOptions: function() {
            return {
                0: this.fiatCurrencyOptions,
                1: this.cryptoCurrencyOptions
            };
        }
    },
    created() {
        
        var fiatCurrencyListUrl = this.$_getFiatCurrencyListURL();
        var cryptoCurrencyListUrl = this.$_getCryptoCurrencyListURL();

        this.$_getCurrencyData( fiatCurrencyListUrl )
            .then( (data) => {
                this.fiatCurrencyOptions = Object.keys( data.rates );
                this.fiatCurrencyOptions.push( data.base );
            } );

        this.$_getCurrencyData( cryptoCurrencyListUrl )
            .then( ( data ) => {
                var currencySymbols = data.symbols;
                currencySymbols.forEach( symbol => {
                    this.cryptoCurrencyList.push( {
                        "symbol"    : symbol.symbol,
                        "baseAsset" : symbol.baseAsset,
                        "quoteAsset": symbol.quoteAsset
                    } );
                    if ( !this.cryptoCurrencyOptions.includes( symbol.baseAsset )) {
                        this.cryptoCurrencyOptions.push( symbol.baseAsset );
                    }
                    if ( !this.cryptoCurrencyOptions.includes( symbol.quoteAsset ) ) {
                        this.cryptoCurrencyOptions.push( symbol.quoteAsset );
                    }
                } );   
            } );
        
    },
    methods: {

        onFromCurrencyInputChange: function( currencyType ) {
            this.fromCurrencyType = this.getCurrencyType(currencyType);
            this.fromCurrencyName = "";
            this.toCurrencyValue = 0;
            this.errorMessage = "";
        },

        onToCurrencyInputChange: function( currencyType ) {
            this.toCurrencyType = this.getCurrencyType(currencyType);
            this.toCurrencyName = "";
            this.toCurrencyValue = 0;
            this.errorMessage = "";
        },

        onFromCurrencyNameChange: function( currencyName ) {
            this.fromCurrencyName = currencyName;
            this.toCurrencyValue = 0;
            this.errorMessage = "";
        },

        onToCurrencyNameChange: function( currencyName ) {
            this.toCurrencyName = currencyName;
            this.toCurrencyValue = 0;
            this.errorMessage = "";
        },

        onFromCurrencyValueChange: function( currencyVal ) {
            this.fromCurrencyValue = currencyVal;
            this.toCurrencyValue = 0;
            this.errorMessage = "";
        },

        getCurrencyType: function( currencyType ) {
            if ( currencyType == 0 ) {
                return "fiat"
            } else {
                return "crypto"
            }
        },

        convertCurrency: function() {
            if ( this.fromCurrencyName != "" && this.toCurrencyName != "" ) {

                this.errorMessage = "";

                if( this.fromCurrencyName == this.toCurrencyName ) {
                    this.toCurrencyValue = this.fromCurrencyValue;
                    return;
                }

                if ( this.fromCurrencyType == "fiat" ) {
                    if ( this.toCurrencyType == "fiat" ) {
                        this.fiatToFiatCurrencyExchange(
                            this.fromCurrencyName,
                            this.toCurrencyName, 
                            this.fromCurrencyValue );
                    } else {
                        this.fiatToCryptoCurrencyExchange(
                            this.fromCurrencyName,
                            this.toCurrencyName,
                            this.fromCurrencyValue );
                    }
                } else {
                    if ( this.toCurrencyType == "fiat" ) {
                        this.cryptoToFiatCurrencyExchangeRate(
                            this.fromCurrencyName,
                            this.toCurrencyName,
                            this.fromCurrencyValue );
                    } else {
                        this.cryptoToCryptoCurrencyExchangeRate(
                            this.fromCurrencyName,
                            this.toCurrencyName,
                            this.fromCurrencyValue );
                    }
                }
            } else {
                this.errorMessage = SELECT_CURRENCY_MSG;
            }
        },

        fiatToFiatCurrencyExchange: function( fromCurrency, 
                                        toCurrency, fromCurrencyVal ) {
            var fiatCurrencyUrl = this.$_getFiatCurrencyExchangeRateURL(
                                        fromCurrency,
                                        toCurrency );
            this.$_getCurrencyData( fiatCurrencyUrl )
                .then( ( data ) => {
                    this.toCurrencyValue = fromCurrencyVal *
                                            data.rates[toCurrency];
                } )
                .catch( () => {
                    this.errorMessage = EXCHANGE_NOT_AVAILABLE_ERR;
                } );
        },

        fiatToCryptoCurrencyExchange: function( fromCurrency, toCurrency,
                                        fromCurrencyVal ) {
            var intermediateCurrency = "EUR";
            var intermediateFiatCurrencyUrl = 
                this.$_getFiatCurrencyExchangeRateURL(
                    fromCurrency,
                    intermediateCurrency );
            this.$_getCurrencyData( intermediateFiatCurrencyUrl ).
                then( ( data ) => {
                    var intermediateExchangeVal = fromCurrencyVal *
                        data.rates[intermediateCurrency];
                    this.cryptoToCryptoCurrencyExchangeRate( 
                        intermediateCurrency,
                        toCurrency,
                        intermediateExchangeVal );
                } )
                .catch( () => {
                    this.errorMessage = EXCHANGE_NOT_AVAILABLE_ERR;
                } )
        },

        cryptoToCryptoCurrencyExchangeRate: function( fromCurrency, toCurrency,
                                                fromCurrencyVal ) {
            var [ cond, symbol ] = this.isCryptoToCryptoCurrencyExchangePossible(
                                        fromCurrency,
                                        toCurrency );
            if ( cond != -1 ) {
                var cryptoCurrencyUrl = 
                    this.$_getCryptoCurrencyExchangeRateURL( symbol );
                this.$_getCurrencyData( cryptoCurrencyUrl )
                    .then( ( data ) => {
                        if ( cond == 0 ) {
                            this.toCurrencyValue = fromCurrencyVal * data.price;
                        } else {
                            this.toCurrencyValue = fromCurrencyVal / data.price;
                        }
                    } )
                    .catch( () => {
                            this.errorMessage = EXCHANGE_NOT_AVAILABLE_ERR;
                    } );
            } else {
                this.errorMessage = EXCHANGE_NOT_AVAILABLE_ERR;
            }
        },

        cryptoToFiatCurrencyExchangeRate: function( fromCurrency, toCurrency,
                                            fromCurrencyVal ) {
            var intermediateCurrency = "EUR";
            var intermediateExchangeVal;
            var [ cond, intermediateSymbol ] = 
                this.isCryptoToCryptoCurrencyExchangePossible(
                    fromCurrency,
                    intermediateCurrency );
            if ( cond != -1 ) {
                var intermediateCryptoCurrencyUrl =
                    this.$_getCryptoCurrencyExchangeRateURL( intermediateSymbol );
                this.$_getCurrencyData( intermediateCryptoCurrencyUrl )
                .then( ( data ) => {
                    if( cond == 0 ) {
                        intermediateExchangeVal = fromCurrencyVal * data.price;
                        this.fiatToFiatCurrencyExchange( 
                            intermediateCurrency,
                            toCurrency,
                            intermediateExchangeVal );
                    } else {
                        intermediateExchangeVal = fromCurrencyVal / data.price;
                        this.fiatToFiatCurrencyExchange(
                            intermediateCurrency,
                            toCurrency,
                            intermediateExchangeVal );
                    }
                    } )
                .catch( () => {
                    this.errorMessage = EXCHANGE_NOT_AVAILABLE_ERR;
                } );
            } else {
                this.errorMessage = EXCHANGE_NOT_AVAILABLE_ERR;
            }
        },

        isCryptoToCryptoCurrencyExchangePossible: function( fromCurrency,
                                                    toCurrency ) {
            var symbol = fromCurrency + toCurrency;
            var cond = 0;
            if ( !this.cryptoCurrencyList.some(symb => symb.symbol == symbol) ) {
                symbol = toCurrency + fromCurrency;
                if ( this.cryptoCurrencyList.some( symb => symb.symbol == symbol ) ) {
                    cond = 1;
                } else {
                    cond = -1;
                }
            }
            return [ cond, symbol ];
        }
    }
}
</script>

<style scoped lang="scss">

    .content {
        display: flex;
        align-self: center;
        justify-content: space-around;
        margin: 2rem;
        padding: 1rem;
        box-shadow: 0 0 10px rgba(0,0,0,.1);

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
