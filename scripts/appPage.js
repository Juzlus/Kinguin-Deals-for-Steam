async function createKinguinBlockEditions()
{
    document.querySelectorAll(".game_area_purchase_game:not(:has(#demoGameBtn, #freeGameBtn))").forEach(async (edition, i) => {
        let title = edition.querySelector("h1").innerHTML;
        const gameId = window.location?.href?.match(/\/app\/(\d+)/)?.[1];
        const bundleId = edition.querySelector(".btn_blue_steamui")?.href?.match(/\/(?:bundle|sub)\/(\d+)/)?.[1];
        if (!gameId || !title) return;
        title = title.slice(title.indexOf(" ") + 1, title.indexOf("<")).trim();
        title = title.slice(0, bundleId ? title.indexOf(' - ') : title.indexOf('Edition'));

        const el = edition.querySelectorAll(".game_purchase_action_bg")
        if (!el || !el.length) return;
        const product = i == 0 ? await getProduct(gameId, title) : bundleId ? await getProduct(bundleId, title, false, true) : await getProduct(null, title, true);

        if (!product) return;
        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = 'kinguin_block kinguin_discount_block_edition'
        div.setAttribute("title", n)
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}" class="btn_green_steamui btn_medium noicon"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        el[el.length - 1].parentNode.insertBefore(div, el[el.length - 1].nextSibling);
    });
}

async function createKinguinBlockDLC()
{
    document.querySelectorAll(".game_area_dlc_row").forEach(async dlc => {
        const title = dlc.querySelector(".game_area_dlc_name").innerText;
        const id = dlc.id.slice(8);
        if (!id || !title) return;

        const product = await getProduct(id, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_dlc ${dlc.querySelector(".discount_pct") ? 'block_long' : ''}`;
        div.setAttribute("title", n);
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        const priceEl = dlc.querySelector(".game_area_dlc_price")
        priceEl.parentNode.insertBefore(div, priceEl.previousSibling);
    });
}

async function createKinguinBlockNewDLC()
{
    document.querySelectorAll(".game_page_autocollapse_ctn iframe").forEach(async newDLC => {

        const gameId = newDLC?.src?.match(/\/widget\/(\d+)/)?.[1];
        if (!gameId) return;

        const product = await getProduct(gameId, gameId);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_newDLC`;
        div.setAttribute("title", n);
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}" class="btn_green_steamui btn_medium noicon"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        newDLC.parentNode.insertBefore(div, newDLC.nextSibling);
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

        const priceEl = other.querySelector(".discount_final_price");

        const div = document.createElement('div');
        div.className = 'kinguin_block kinguin_discount_block_other'
        div.setAttribute("title", n)
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        priceEl?.parentNode.insertBefore(div, priceEl.nextSibling);
    });
}

async function createKinguinBlock()
{ 
    createKinguinBlockEditions();
    createKinguinBlockDLC();
    createKinguinBlockNewDLC();
    setTimeout(() => {
        createKinguinBlockOthers();
    }, 100);
}

createKinguinBlock();