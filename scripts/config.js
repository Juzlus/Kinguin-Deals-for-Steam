let currencyRates = [];
const kinguinRatesURL = `https://www.kinguin.net/services/currency/api/v1/rates`;

const allTypes = ["Account", "CD Key", "Altergift", "Gift"];
const allRegions = ["WW_WW (World Wide)", "RoW_RoW (Rest of World)", "EU_EU (European Union)", "NA_NA (North America)", "LATAM_LATAM (Latin America)", "ASIA_Asia", "CIS_CIS (Commonwealth of<br>Independent States)", "RU_RU (Russia)", "TURKEY_Turkey", "DE_DE (Germany)", "UK_UK (United Kingdom)", "AU_AU (Australia)", "FR_FR (France)", "ES_ES (Spain)", "SEA_SEA (Southeast Asia)", "Oceania_Oceania"];
const allCurencies = ["EUR", "USD", "PLN", "GBP", "SEK", "CAD", "AED", "AUD", "AZN", "BDT", "BGN", "BHD", "BRL", "CHF", "CNY", "CZK", "DKK", "DZD", "HKD", "HUF", "ILS", "INR", "JOD", "JPY", "KRW", "KWD", "KZT", "MAD", "MXN", "MYR", "NOK", "NZD", "PKR", "QAR", "RON", "RUB", "SAR", "SGD", "TND", "TRY", "UZS", "ZAR"];

let config = {
    deliveryType: ["CD Key", "Altergift", "Gift"],
    regions: ["WW", "RoW", "EU"],
    currency: 'EUR',
    cooldown: 6
}

let defaultCurrencyInfo = {
    code: "EUR",
    symbol: "€",
    rate: "1",
    format: "%0.2f",
    symbolPlace: "PREFIX"
}