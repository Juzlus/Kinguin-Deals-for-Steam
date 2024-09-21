function createKinguinBlock()
{
    const elements = Array.from(document.querySelectorAll('[tabindex="0"].Focusable'));
    if (!elements || !elements?.length) return;

    elements.reverse().forEach(async (parent, i) => {
        const href = parent.querySelector("a")?.href || parent?.href;
        if (!href) return;

        const gameId = href?.match(/\/app\/(\d+)/)?.[1];
        const title = href?.slice(href.indexOf(gameId) + gameId.length + 1, href.indexOf("?snr")).replace(/_/g, ' ') || gameId;
        if (!gameId || !title) return;

        const product = await getProduct(gameId, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        const div = document.createElement('div');
        div.className = `kinguin_block kinguin_discount_block_${i <= 2 ? 'big' : i <= 4 ? 'medium' : 'small'}`;
        div.setAttribute("title", n);
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        i <= 4 ? parent?.appendChild(div) : parent?.parentNode?.parentNode?.appendChild(div);
    });
}

setTimeout(() => {
    createKinguinBlock();
}, 1000);