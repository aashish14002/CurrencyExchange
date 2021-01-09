import axios from "axios"
import { UrlConst } from './config.js';

export default{
    name: "apiService",
    data(){
        return{
            
        }
    },
    methods: {
        $_getFiatCurrencyListURL: function() {
            return UrlConst.FiatCurrencyUrl;
        },

        $_getFiatCurrencyExchangeRateURL: function(from, to) {
            if(from == "EUR"){
                return UrlConst.FiatCurrencyUrl + "?symbols=" + to;
            } else {
                return UrlConst.FiatCurrencyUrl + "?base="+ from + "&" + "symbols=" + from + "," + to;   
            }
        },

        $_getCryptoCurrencyListURL: function() {
            return UrlConst.CryptoCurrencyUrl + "exchangeInfo";
        },

        $_getCryptoCurrencyExchangeRateURL: function(symbol) {
            return UrlConst.CryptoCurrencyUrl + "ticker/price?symbol=" + symbol;
        },
        
        $_getCurrencyData: function(url){
            return axios.get(url).then( result =>{
                return result.data
            }, error => {
                return error;
            });
        }
    }
}