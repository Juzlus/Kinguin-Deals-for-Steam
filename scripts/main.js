let kinguinProducts = null;

async function fetchData(url) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'fetchData', url: url }, response => {
            resolve(response?.success ? response.data : null);
        });
    });
}

async function fetchAllProducts() {
    let page = 0;
    let attempts = 0;
    let priceLowest = 0;
    let _priceLowest = -1;

    const products = [];
    while (true)
    {
        if (attempts >= 50)
            break;
        attempts++;

        const url = `https://www.kinguin.net/services/library/api/v1/products/search?platforms=2&active=1&hideUnavailable=0&sort=price.lowestOffer,ASC&visible=1&store=kinguin&phrase=&size=3000&page=${page}&priceFrom=${priceLowest}`;
        console.log(`[Kinguin Deals for Steam] Fetching products...`);
        const data = await fetchData(url);
        if (!data)
        {
            page = 0;
            if (priceLowest == _priceLowest)
                break;
            priceLowest = _priceLowest;
            continue;
        }
        let _products = data?._embedded?.products;
        if (_products.length <= 0)
        {
            page = 0;
            if (priceLowest == _priceLowest)
                break;
            priceLowest = _priceLowest;
            continue;
        }
        changeLoadingText(`Loading products...<br>Loaded ${products.length} products`);
        _products.forEach(el => {
            if (!products.some(p => p.externalId == el.externalId))
                products.push({ n: el.name, kId: el.externalId, sId: el.attributes.steamId, p: el.price.lowestOffer, r: el.attributes.region.id })
        });
        _priceLowest = _products[_products.length - 1].price.lowestOffer;
        page++;
    }

    if (attempts > 50)
    {
        changeLoadingText(`Something went wrong<br>Refresh the page`);
        return;
    }

    const now = new Date().getTime();
    console.log(`[Kinguin Deals for Steam] Loaded ${products.length} products.`);
    localStorage.setItem("kinguinProducts", LZString.compress(JSON.stringify({ products: products, createdAt: now })));
    kinguinProducts = { products: products, createdAt: now };
    changeLoadingText(`Loaded ${products.length} products<br>Refreshing page...`);
    setTimeout(()=>{
        window.location.reload();
    }, 5 * 1000);
}

function resetStorage()
{
    console.log("[Kinguin Deals for Steam] The storages (kinguinProducts and kinguinCurrencies) has been cleared");
    localStorage.removeItem("kinguinProducts");
    sessionStorage.removeItem("kinguinCurrencies");
}

function decompressProductList()
{
    let storage = localStorage.getItem("kinguinProducts");
    if (!storage) return;
    storage = JSON.parse(LZString.decompress(storage));
    kinguinProducts = storage;
}

function refreshConfig()
{
    data = sessionStorage.getItem("kinguin_config");
    config = data ? JSON.parse(data) : config;
}

function levenshteinDistance(a, b)
{
    const tab = Array(b.length + 1).fill(null).map(() =>
    Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i += 1)
        tab[0][i] = i;
    for (let j = 0; j <= b.length; j += 1)
        tab[j][0] = j;

    for (let j = 1; j <= b.length; j += 1) {
        for (let i = 1; i <= a.length; i += 1) {
            const c = a[i - 1] === b[j - 1] ? 0 : 1;
            tab[j][i] = Math.min(
                tab[j][i - 1] + 1,
                tab[j - 1][i] + 1,
                tab[j - 1][i - 1] + c,
            );
        }
    }
    return tab[b.length][a.length];
};

function convertTitle(title)
{
    title = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
    return title.split(" ");
}

async function getProduct(id, name, byName=false, bundle=false)
{
    if (!kinguinProducts) return;
    const products = kinguinProducts?.products?.filter(el => 
        config.deliveryType?.some(type => el.n.includes(`Steam ${type}`)) 
        && (config.regions?.some(r => el.n.includes(r)) || !allRegions.some(r => el.n.includes(r.split("_")[0])))
        && (byName ? convertTitle(name)?.every(tit => ` ${el.n} `.toLowerCase().includes(` ${tit} `)) : el?.sId == id)
       // && ((bundle && byName) ?  : true)
        && ((bundle && !byName) ? el.n.includes("Bundle") : true)
    );
    if(byName)
        console.log(convertTitle(name), products)

    if (products.length <= 0)
        if (!byName)
            return getProduct(id, name, true, bundle);
        else
            return;

    let lowerLevenshtein = null;
    products.forEach(el => {
        el.levenshtein = levenshteinDistance(el.n, name);
        if (!lowerLevenshtein)
            lowerLevenshtein = el;
        else if (el.levenshtein < lowerLevenshtein.levenshtein)
            lowerLevenshtein = el;
    });

    const filtered = products.filter(el => levenshteinDistance(el.n, name) <= lowerLevenshtein.levenshtein + 10);
    return filtered.length ? filtered[0] : lowerLevenshtein;
}

function convertPrice(USDprice)
{
    const currencies = sessionStorage.getItem("kinguinCurrencies");
    const currencyInfo = currencies ? JSON.parse(currencies)?.filter(el => el.code == config.currency)[0] : defaultCurrencyInfo;
    const priceFormat = USDprice * parseFloat(currencyInfo.rate) / 100;
    const currencyFormat = parseInt(currencyInfo.format.slice(3, -1));
    const priceText = priceFormat.toFixed(currencyFormat).toString();
    return currencyInfo.symbolPlace == "PREFIX" ? `${currencyInfo.symbol}${priceText}` : `${priceText} ${currencyInfo.symbol}`; 
}

function createLoadingInfo()
{
    var div = document.createElement("div");
    div.innerHTML = "<span>Loading products...<br>Loaded 0 products</span>";
    div.setAttribute("id", "kinguin_loading");
    document.body.after(div);
}

function changeLoadingText(newText)
{
    document.querySelector('#kinguin_loading span').innerHTML = newText;
}

async function setupCurrency()
{
    const fetch = await fetchData(kinguinRatesURL);
    if (!fetch) return;
    const currencyRates = fetch?.filter(el => el?.active == true);
    sessionStorage.setItem("kinguinCurrencies", JSON.stringify(currencyRates));
}

refreshConfig();
decompressProductList();

const now = new Date().getTime();
if (kinguinProducts && config.cooldown != 43)
    if (kinguinProducts?.createdAt + (config.cooldown * 3600000) < now)
        resetStorage();

if (!localStorage.getItem("kinguinCurrencies"))
    setupCurrency();

if (!localStorage.getItem("kinguinProducts"))
{
    createLoadingInfo();
    fetchAllProducts();
}
else
    try {
        createKinguinBlock();
    } catch(e) {};