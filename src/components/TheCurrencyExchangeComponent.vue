<template>
    <div>
        <div class="content"> 
            
            <base-currency-input
                :heading="fromCurrencyLabel"
                :currency-type-label0="fromCurrencyTypeLabel"
                :currency-type-label1="toCurrencyTypeLabel"
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
                :currency-type-label0="fromCurrencyTypeLabel"
                :currency-type-label1="toCurrencyTypeLabel"
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
import { ErrorMsg, LabelMsg } from './../config.js';


export default {
    name: 'TheCurrencyExchangeComponent',
    mixins: [apiService],
    components: {
        BaseCurrencyInput
    },
    data() {
        return {
            fromCurrencyLabel: LabelMsg.FromCurrencyLabel,
            toCurrencyLabel: LabelMsg.ToCurrencyLabel,

            fromCurrencyTypeLabel: LabelMsg.FromCurrencyTypeLabel,
            toCurrencyTypeLabel: LabelMsg.ToCurrencyTypeLabel,

            toCurrencyOptions: [],
            fromCurrencyOptions: [],

            fromCurrencyName: "",
            toCurrencyName: "",

            fromCurrencyType: LabelMsg.FromCurrencyType,
            toCurrencyType: LabelMsg.FromCurrencyType,

            fromCurrencyValue: 0,
            toCurrencyValue: 0,

            cryptoCurrencyList: [],

            errorMessage: ""
        }
    },
    computed: {
        currencyOptions: function() {
            return {
                0: this.fromCurrencyOptions,
                1: this.toCurrencyOptions
            };
        }
    },
    created() {
        
        var fiatCurrencyListUrl = this.$_getFiatCurrencyListURL();
        var cryptoCurrencyListUrl = this.$_getCryptoCurrencyListURL();

        //populates from currency options
        this.$_getCurrencyData( fiatCurrencyListUrl )
            .then( (data) => {
                this.fromCurrencyOptions = Object.keys( data.rates );
                this.fromCurrencyOptions.push( data.base );
            } );

        //populates to currency options and generate crypto currency list for
        //verifying whether the exchange is possible between two crypto currencies
        this.$_getCurrencyData( cryptoCurrencyListUrl )
            .then( ( data ) => {
                var currencySymbols = data.symbols;
                currencySymbols.forEach( symbol => {
                    this.cryptoCurrencyList.push( {
                        "symbol"    : symbol.symbol,
                        "baseAsset" : symbol.baseAsset,
                        "quoteAsset": symbol.quoteAsset
                    } );
                    if ( !this.toCurrencyOptions.includes( symbol.baseAsset )) {
                        this.toCurrencyOptions.push( symbol.baseAsset );
                    }
                    if ( !this.toCurrencyOptions.includes( symbol.quoteAsset ) ) {
                        this.toCurrencyOptions.push( symbol.quoteAsset );
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
                return LabelMsg.FromCurrencyType;
            } else {
                return LabelMsg.ToCurrencyType;
            }
        },

        convertCurrency: function() {
            if ( this.fromCurrencyName != "" && this.toCurrencyName != "" ) {

                this.errorMessage = "";

                if( this.fromCurrencyName == this.toCurrencyName ) {
                    this.toCurrencyValue = this.fromCurrencyValue;
                    return;
                }

                if ( this.fromCurrencyType == LabelMsg.FromCurrencyType ) {
                    if ( this.toCurrencyType == LabelMsg.FromCurrencyType ) {
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
                    if ( this.toCurrencyType == LabelMsg.FromCurrencyType ) {
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
                this.errorMessage = ErrorMsg.SELECT_CURRENCY_MSG;
            }
        },

        //sends request to get exchange rate for fiat currencies and updates
        //the converted currency value or display a message in case of error
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
                    this.errorMessage = ErrorMsg.EXCHANGE_NOT_AVAILABLE_ERR;
                } );
        },

        //For converting fiat currency to crypto currency, it first convert the
        //given fiat currency to EUR and then convert the EURO to the given
        //crypto currency. Then it either updates the converted currency value
        //or display a message in case of error
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
                    this.errorMessage = ErrorMsg.EXCHANGE_NOT_AVAILABLE_ERR;
                } )
        },

        //First checks whether the exchange rate is available for fromCurrency
        //to toCurrency or vice-versa. If not, then display a error message.
        //otherwise, sends request to get exchange rate for crypto currencies
        //and updates the converted currency value or display a message in case
        //of error
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
                            this.errorMessage = ErrorMsg.EXCHANGE_NOT_AVAILABLE_ERR;
                    } );
            } else {
                this.errorMessage = ErrorMsg.EXCHANGE_NOT_AVAILABLE_ERR;
            }
        },
        
        //For converting crypto currency to fiat currency, it first convert the
        //given crypto currency to EUR and then convert the EURO to the given
        //fiat currency. Then it either updates the converted currency value
        //or display a message in case of error
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
                    this.errorMessage = ErrorMsg.EXCHANGE_NOT_AVAILABLE_ERR;
                } );
            } else {
                this.errorMessage = ErrorMsg.EXCHANGE_NOT_AVAILABLE_ERR;
            }
        },

        //checks whether the exchange rate between two crypto currencies is 
        //available. First, check the exchange rate for  FromCurrency - ToCurrency
        //and if its available then, returns [ 0,  << fromCurrency + toCurrency >> ].
        //Else if its avilable for ToCurrency - FromCurrency then returns 
        //[ 1,  << toCurrency + fromCurrency >> ], else returns
        //[ -1, << fromCurrency + toCurrency >> ]
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

@import "./../assets/scss/_variables.scss";

.content {
    display: flex;
    align-self: center;
    justify-content: space-around;
    margin: 2rem;
    padding: 1rem;
    box-shadow: 0 0 0.7rem rgba(0,0,0,.1);

    .currency-convert {
        flex-basis: 6%;
        align-self:center;
        .convert-button {
            width: 100%;
            box-shadow: 0 0 0.35rem -0.06rem rgba(0,0,0,0.2);
            cursor:pointer;
            padding: 0.3rem;
        }
        .convert-button:active {
            box-shadow: 0 0 0.35rem -0.06rem rgba(0,0,0,0.6);
        }
    }

}

.error-bar {
    color: $error-msg-color;
    background-color:$error-msg-background;
    border: 0.06rem solid;
    background-repeat: no-repeat;
    background-position: 0.7rem center;
}

</style>
