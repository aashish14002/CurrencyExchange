import axios from "axios"
// import constants from "constants"

export default{
    name: "apiService",
    data(){
        return{
            FIAT_CURRENCY_URL : "https://api.exchangeratesapi.io/latest/"
        }
    },
    methods: {
        getAllFiatCurrency: function(){
            return axios.get(this.FIAT_CURRENCY_URL).then( result =>{
                return result.data
            }, error => {
                return error;
            });
        },
        getFiatCurrencyExchangeRate: function(from, to){
            return axios.get(this.FIAT_CURRENCY_URL + "?base="+ from + "&" + "symbols=" + from + "," + to).then( result =>{
                return result.data.rates
            }, error => {
                return error;
            });
        }
    }
}