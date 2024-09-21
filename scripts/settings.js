function updateConfig() {
    config.deliveryType = Array.from(document.querySelectorAll("input[name='kinguin_method']:checked")).map(el => el.value);
    config.regions = Array.from(document.querySelectorAll("input[name='kinguin_region']:checked")).map(el => el.value);
    config.currency = document.querySelector("input[name='kinguin_currency']:checked").value;
    config.cooldown = parseInt(document.getElementById("storage_cooldown").value);
    sessionStorage.setItem("kinguin_config", JSON.stringify(config));

    refreshConfig();
    document.querySelectorAll(".kinguin_block").forEach(el => el.remove());
    document.querySelectorAll(".multiply_discount_block").forEach(el => el.classList.remove("multiply_discount_block"));
    createKinguinBlock();
}

function updateSlider(hour) {
    document.getElementById("storage_cooldown_text").innerText = hour == 0 ? 'everytime' : hour == 43 ? 'never' : `${hour}h`;
}

function createSettingsPanel() {
    let methodsHTML = "";
    allTypes.forEach(el => methodsHTML += `<label><input type="checkbox" name="kinguin_method" value="${el}"><span>${el}</span></label>`);

    let regionsHTML = "<div class='regional_block'>";
    allRegions.forEach((el, i) => {
        regionsHTML += `<label><input type="checkbox" name="kinguin_region" value="${el.split('_')[0]}"><span>${el.split('_')[1]}</span></label>`;
        if ((i + 1) % 4 == 0)
            regionsHTML += `</div><div class="regional_block">`;
    });
    regionsHTML += '</div>';

    let currenciesHTML = "<div class='regional_block'>";
    allCurencies.forEach((el, i) => {
        currenciesHTML += `<label><input type="radio" name="kinguin_currency" value="${el}"><span>${el}</span></label>`;
        if ((i + 1) % 6 == 0)
            currenciesHTML += `</div><div class="regional_block">`;
    });
    currenciesHTML += '</div>';

    const settings_panel = document.createElement("div");
    settings_panel.setAttribute("id", "kinguin_settings");
    settings_panel.classList.add("hide_panel");
    settings_panel.innerHTML = `<div id="kinguin_settings_main"><h2>Kinguin Deals for Steam</h2><p>Delivery Type</p><div id="kinguin_types">${methodsHTML}</div><p>Regional Restrictions</p>  <div id="kinguin_regions">${regionsHTML}</div><p>Currency</p><div id="kinguin_currencies">${currenciesHTML}</div><p>Data Storage</p><div id="kinguin_storage"><span><span>Automatic data deletion: <span id="storage_cooldown_text">6h</span></span><input type="range" min="0" max="43" value="6" id="storage_cooldown"></span><button id="kinguin_reset">RESET DATA</button></div></div>`;
    settings_panel.onclick = function(event) {
        if (event.target?.id != "kinguin_settings") return;
        const isHide = this.classList.contains("hide_panel");
        this.classList.remove(isHide ? "hide_panel" : "show_panel")
        this.classList.add(isHide ? "show_panel" : "hide_panel");
    };
    document.body.append(settings_panel);

    document.querySelector(".header_installsteam_btn.header_installsteam_btn_gray")?.remove();
}

function createSettingsButton() {
    const settings_button = document.createElement("div");
    settings_button.setAttribute("id", "kinguin_settings_button")
    settings_button.onclick = function() {
        const isHide = document.getElementById("kinguin_settings").classList.contains("hide_panel");
        document.getElementById("kinguin_settings").classList.remove(isHide ? "hide_panel" : "show_panel")
        document.getElementById("kinguin_settings").classList.add(isHide ? "show_panel" : "hide_panel");
    };
    document.getElementById("global_action_menu").before(settings_button);
}

function setupSettings() {
    refreshConfig();
    document.querySelectorAll('input[name="kinguin_method"]').forEach(el => {
        if (config.deliveryType?.includes(el.value))
            el.checked = true;
    });
    document.querySelectorAll('input[name="kinguin_region"]').forEach(el => {
        if (config.regions?.includes(el.value))
            el.checked = true;
    });
    document.querySelector(`input[name="kinguin_currency"][value="${config.currency}"]`).checked = true;
    document.getElementById("storage_cooldown").value = config.cooldown;
    updateSlider(config.cooldown);

    document.querySelectorAll("input[name='kinguin_method']").forEach(el => { el.onclick = () => updateConfig(); });
    document.querySelectorAll("input[name='kinguin_region']").forEach(el => { el.onclick = () => updateConfig(); });
    document.querySelectorAll("input[name='kinguin_currency']").forEach(el => { el.onclick = () => updateConfig(); });
    document.getElementById("storage_cooldown").oninput = (e) => { updateSlider(e.target.value); };
    document.getElementById("storage_cooldown").onchange = (e) => { updateConfig(); };
    document.getElementById("kinguin_reset").onclick = () => {
        resetStorage();
        window.location.reload();
    };
}

createSettingsPanel();
createSettingsButton();
setupSettings();
