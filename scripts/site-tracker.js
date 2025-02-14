//browser.webNavigation.onCommitted.addListener((details) => {
//    console.log(details);
//})

let tabsTracked = [];
let sitesTracked = [];
let weekArray = [...weekGenerator()];

initSiteGlobal().then((sites) => {
    for(let i = 0; i < sites.length; i++) {
        sitesTracked[i] = sites[i]; 
    }
}).catch((err) => {
    console.error(err);
});
    
initWeekArray().then((week) => {
    for(let i = 0; i < week.length; i++) {
        weekArray[i] = week[i]; 
    }
}).catch((err) => {
    console.error(err);
}); 

browser.storage.local.onChanged.addListener(handleStorageChange)

/* TABS */
browser.tabs.onCreated.addListener(handleTabCreation);
browser.tabs.onRemoved.addListener(handleTabRemoval);

/* WEB NAV */
browser.webNavigation.onCommitted.addListener(handleWebNav)

/////////////////////////////////////////////////////////////////////////////

function* weekGenerator() {
    for(let i = 0; i < 7; i++) {
        yield {
            sites: []
        };
    }
}

function* urlFilterGenerator(urlArr) {
    for(let i = 0; i < urlArr.length; i++) {
        yield {
            urlPrefix: urlArr[i]
        };
    }
}


function handleStorageChange(changes) {
   sitesTracked = changes.sites.newValue;
}

async function handleWebNav(details) {
    for(const site of sitesTracked) {
        let trackedUrl = site.url;
        let prefix = new RegExp(trackedUrl);
        //console.log(prefix.test("https://x.com"));
        if(prefix.test(details.url)) {
            let tab = await browser.tabs.get(details.tabId);
            if(!tabsTracked.includes(tab)) {
                tabsTracked.push(tab);
                console.log(tabsTracked);
                return;
            }
        }
    }
}

function handleTabCreation(tab) {
    if(sitesTracked.includes(tab.url)) {
        tabsTracked.push(tab);
        console.log(tabsTracked);
    }
}

function handleTabRemoval(tabId) {
    let index = tabsTracked.findIndex((t) => t.id === tabId);
    if(index !== -1) {
        tabsTracked.splice(index, 1);
        console.log(tabsTracked);
    }
}


async function initWeekArray() {
    try {
        let weekObj = await browser.storage.local.get("week");
        let newWeek;
        if(Object.entries(weekObj).length == 0) {
            newWeek = [...weekGenerator()];
            await browser.storage.local.set({
                week: newWeek
            })
        } else {
            newWeek = weekObj.week;
        }
        return newWeek;
    } catch(err) {
        console.error(err);
        return [...weekGenerator()];
    }
}

async function initSiteGlobal() {
    try {
        let siteObj = await browser.storage.local.get("sites");
        if(Object.entries(siteObj).length == 0) {
            await browser.storage.local.set({
                sites: []
            })
            return [];
        } 
        return siteObj.sites;
    } catch(err) {
        console.error(err);
        return [];
    }
}
