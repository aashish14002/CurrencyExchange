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
            var currencyOptions = []
            axios.get(this.FIAT_CURRENCY_URL).then( result =>{
                currencyOptions = result.data
                console.log(currencyOptions);
            }, error => {
                console.log(error);
            });
            return currencyOptions;
        }
    }
}