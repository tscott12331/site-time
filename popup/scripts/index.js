let addSiteButton = document.getElementById("add-site-button");

let addSitePopup = document.getElementById("popup-wrapper");
addSitePopup.style.visibility = "hidden";

let addSiteInput = document.getElementById("popup-site-input")

addSiteButton.addEventListener("click", () => {
    togglePopupVisibility();
})

addSiteInput.addEventListener("keypress", async (e) => {
    if(e.key == "Enter" && addSiteInput.checkValidity()) {
        await addSite(addSiteInput.value);
        addSiteInput.value = "";
        togglePopupVisibility();
    }
})

////////////////////////////////////////////////////////////////////////////
async function addSite(url) {
    try {
        let curSitesObj = await browser.storage.local.get(["sites"]);
        let newUrlObj = {
            url,
            timeUsed: 0
        }
        let newSites = Object.entries(curSitesObj).length == 0 ? [newUrlObj] : [...curSitesObj.sites, newUrlObj];  

        await browser.storage.local.set({
            sites: newSites 
        }); 
    } catch(err) {
        console.error(err);
    }
    
}

function togglePopupVisibility() {
    let vis = addSitePopup.style.visibility == "hidden" ? "visible" : "hidden";
    addSiteInput.blur();
    addSitePopup.style.visibility = vis;
}
