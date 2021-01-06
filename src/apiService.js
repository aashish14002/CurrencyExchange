import axios from "axios"
// import constants from "constants"

export default{
    name: "apiService",
    data(){
        return{
            FIAT_CURRENCY_URL : "https://api.exchangeratesapi.io/latest/",
            CRYPTO_CURRENCY_URL : "https://api.binance.com/api/v3/"
        }
    },
    created() {
        
    },
    methods: {
        getFiatCurrencyListURL: function() {
            return this.FIAT_CURRENCY_URL;
        },
        getFiatCurrencyExchangeRateURL: function(from, to) {
            if(from == "EUR"){
                return this.FIAT_CURRENCY_URL + "?symbols=" + to;
            } else {
                return this.FIAT_CURRENCY_URL + "?base="+ from + "&" + "symbols=" + from + "," + to;   
            }
        },
        getCryptoCurrencyListURL: function() {
            return this.CRYPTO_CURRENCY_URL + "exchangeInfo";
        },
        getCryptoCurrencyExchangeRateURL: function(symbol) {
            return this.CRYPTO_CURRENCY_URL + "ticker/price?symbol=" + symbol;
        },
        getCurrencyData: function(url){
            return axios.get(url).then( result =>{
                return result.data
            }, error => {
                return error;
            });
        }
    }
}