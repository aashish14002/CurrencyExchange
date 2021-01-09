//Stores all the constants, labels and error messages used in the application

export const ErrorMsg = Object.freeze( {
    EXCHANGE_NOT_AVAILABLE_ERR: "Exchange Rate not available for this currency",
    SELECT_CURRENCY_MSG: "Please Select Currencies!"
} );

export const LabelMsg = Object.freeze( {
    FromCurrencyLabel: "Currency I Have",
    ToCurrencyLabel: "Cuurency I Want",
    FromCurrencyTypeLabel: "Fiat Currency",
    ToCurrencyTypeLabel: "Crypto Currency",
    FromCurrencyType: "fiat",
    ToCurrencyType: "crypto"
} );

export const UrlConst = Object.freeze( {
    FiatCurrencyUrl : "https://api.exchangeratesapi.io/latest/",
    CryptoCurrencyUrl : "https://api.binance.com/api/v3/"
} );

