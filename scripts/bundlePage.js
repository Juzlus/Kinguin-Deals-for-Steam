async function createKinguinBlockBundle()
{
    document.querySelectorAll(".game_area_purchase_game").forEach(async bundle => {
        let title = bundle.querySelector("h1").innerHTML;
        const bundleId = window.location.href?.match(/\/(?:bundle|sub)\/(\d+)/)?.[1];

        if (!bundleId || !title) return;
        title = title.slice(title.indexOf(" ") + 1, title.indexOf("<")).trim();

        const el = bundle.querySelector(".game_purchase_action_bg")
        if (!el) return;

        const product = await getProduct(bundleId, title, false, true);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = 'kinguin_block kinguin_discount_block_edition'
        div.setAttribute("title", n)
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}" class="btn_green_steamui btn_medium noicon"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        el.parentNode.insertBefore(div, el.nextSibling);
    });
}

async function createKinguinBlockBundleItem()
{
    document.querySelectorAll(".tablet_list_item").forEach(async item => {
        const title = item.querySelector(".tab_item_name").innerText;
        const id = item?.getAttribute("data-ds-appid");
        if (!id || !title) return;

        const product = await getProduct(id, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_bundleItem ${item.querySelector(".discount_pct") ? 'block_long' : ''}`;
        div.setAttribute("title", n)
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        const priceEl = item.querySelector(".discount_final_price")
        priceEl.parentNode.insertBefore(div, priceEl.previousSibling);
    });
}

async function createKinguinBlockOthers()
{
    document.querySelectorAll(".small_cap").forEach(async other => {
        const gameId = other.getAttribute("data-ds-appid");
        const title = other.querySelector("h4").innerText;
        if (!gameId || !title) return;

        const product = await getProduct(gameId, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const priceEl = other.querySelector(".discount_final_price") || other.querySelector("h5");
        if (priceEl?.innerText == "Free to Play") return;
        
        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_other ${priceEl?.classList?.length ? '' : 'kinguin_sub'}`
        div.setAttribute("title", n)
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        priceEl?.parentNode.insertBefore(div, priceEl.nextSibling);
    });
}

async function createKinguinBlock()
{ 
    createKinguinBlockBundle();
    createKinguinBlockBundleItem();
    setTimeout(() => {
        createKinguinBlockOthers();
    }, 100);
}

createKinguinBlock();