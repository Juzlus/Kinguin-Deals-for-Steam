async function createKinguinBlockCapsuleItem()
{
    document.querySelectorAll(".store_capsule_container").forEach(async (parent) => {
        const hrefEl = parent.querySelector("a");
        if (!hrefEl || !hrefEl.href) return;

        const gameId = hrefEl?.href?.match(/\/app\/(\d+)/)?.[1];
        if(!gameId) return;
        const title = hrefEl?.href?.slice(hrefEl?.href.indexOf(gameId) + gameId.length + 1, hrefEl?.href.indexOf("/?snr")).replace(/_/g, ' ') || gameId;
        if (!gameId || !title) return;

        const product = await getProduct(gameId, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_capsule_container`;
        div.setAttribute("title", n);
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        hrefEl.querySelector(".price_row")?.appendChild(div);
    });
}

async function createKinguinBlockRecommendation()
{
    document.querySelectorAll(".recommendation").forEach(async (parent) => {
        if (parent.querySelector(".kinguin_discount_block_capsule_recommendation")) return;
        const hrefEl = parent.querySelector("a.recommendation_link");
        if (!hrefEl || !hrefEl.href) return;

        const gameId = hrefEl?.href?.match(/\/app\/(\d+)/)?.[1];
        if(!gameId) return;
        const title = hrefEl?.href?.slice(hrefEl?.href.indexOf(gameId) + gameId.length + 1, hrefEl?.href.indexOf("/?snr")).replace(/_/g, ' ') || gameId;
        if (!gameId || !title) return;

        const product = await getProduct(gameId, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_capsule_container kinguin_discount_block_capsule_recommendation`;
        div.setAttribute("title", n);
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        hrefEl?.appendChild(div);
    });
}

async function createKinguinBlock()
{
    createKinguinBlockCapsuleItem();
    createKinguinBlockRecommendation();
}

const observer = new MutationObserver(() => {
    createKinguinBlockRecommendation();
});
  
const recommendations = document.getElementById("RecommendationsTable");
if (recommendations)
    observer.observe(recommendations, {
        attributes: true,
        attributeFilter: ['class']
    });

setTimeout(() => {
    createKinguinBlock();
}, 100);