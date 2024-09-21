function createKinguinBlock()
{
    document.querySelectorAll(".expanded.Panel.Focusable")?.forEach(el => {
        const elements = Array.from(document.querySelectorAll('[tabindex="0"].Focusable'));
        if (!elements || !elements?.length) return;

        elements.reverse().forEach(async (parent, i) => {
            if (parent.querySelector(".kinguin_discount_block_small")) return;
            const href = parent.querySelector("a")?.href || parent?.href;
            if (!href) return;

            const gameId = href?.match(/\/app\/(\d+)/)?.[1];
    //console.log(href) 
            const title = href?.slice(href.indexOf(gameId) + gameId.length + 1, href.indexOf("?snr")).replace(/_/g, ' ') || gameId;
            if (!gameId || !title) return;

            const product = await getProduct(gameId, title);
            if (!product) return;

            const { kId, p, n } = product;
            const priceText = convertPrice(p);

            const div = document.createElement('div');
            div.className = `kinguin_block kinguin_discount_block_small`;
            div.setAttribute("title", n);
            div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
            parent?.parentNode?.parentNode?.appendChild(div);
        });
    });
}

setTimeout(() => {
    createKinguinBlock();
}, 1000);