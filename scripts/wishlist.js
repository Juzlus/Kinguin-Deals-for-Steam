async function createKinguinBlock()
{
    document.querySelectorAll('.wishlist_row').forEach(async (parent) => {
        if (parent.querySelector(".kinguin_discount_block")) return;

        const el = parent.querySelector(".discount_block.discount_block_large")
        if (!el) return;

        const titleElement = parent.querySelector('.title');
        const gameId = titleElement?.href?.match(/\/app\/(\d+)/)?.[1];
        const title = titleElement.innerText;
        if (!gameId || !title) return;

        const product = await getProduct(gameId, title);
        if (!product) return;

        const { kId, p, n } = product;
        const priceText = convertPrice(p);

        parent.querySelector(".purchase_area").classList.add("multiply_discount_block");

        const div = document.createElement('div');
        div.className = 'kinguin_block kinguin_discount_block'
        div.setAttribute("title", n)
        div.innerHTML = `<a href="https://www.kinguin.net/pl/category/${kId}" class="btn_green_steamui btn_medium noicon"><span><span class="kinguin_crown"></span>${priceText}</span></a>`;
        el.parentNode.insertBefore(div, el.nextSibling);
    });
}

const observer = new MutationObserver(() => {
    createKinguinBlock();
});
  
observer.observe(document.getElementById("wishlist_ctn"), {
    childList: true,
    subtree: false,
});

setTimeout(() => {
    createKinguinBlock();
}, 100);
