let addSiteButton = document.getElementById("add-site-button");

let addSitePopup = document.getElementById("popup-wrapper");
addSitePopup.style.visibility = "hidden";

let addSiteInput = document.getElementById("popup-site-input")

addSiteButton.addEventListener("click", () => {
    togglePopupVisibility();
})

addSiteInput.addEventListener("keypress", (e) => {
    if(e.key == "Enter" && addSiteInput.checkValidity()) {
        addSite(addSiteInput.value);
        addSiteInput.value = "";
        togglePopupVisibility();
    }
})

////////////////////////////////////////////////////////////////////////////
function addSite(url) {
    console.log("adding", url);
}

function togglePopupVisibility() {
    let vis = addSitePopup.style.visibility == "hidden" ? "visible" : "hidden";
    addSiteInput.blur();
    addSitePopup.style.visibility = vis;
}
