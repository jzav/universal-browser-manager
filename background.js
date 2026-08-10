browser.browserAction.onClicked.addListener(openMyPage);
 
async function openMyPage(e) {
      const views = browser.extension.getViews({
            windowId: e.windowId,
            type: "tab"
      });
      if (views.length == 0) {
            browser.tabs.create({
                  "index": 0,
                  "url": "ayc/ayc.html",
                  "pinned": true
            });
      } else {
            const tabs = await browser.tabs.query({
                  windowId: e.windowId,
                  url: views[0].location.href
            });
            browser.tabs.highlight({
                  windowId: e.windowId,
                  tabs: tabs[0].index
            });
      }
}
 