// on first install add these hooks
chrome.runtime.onInstalled.addListener(function () {
  console.log("Netflix Party Better Chat installed")
  // the URL to watch for (same as manifest permissions)
  const URL = 'https://www.netflix.com/watch/'

  // Injects the content.js and style.css
  const init = () => {
    console.log("Netflix Party Better Chat: Netflix Detected")
    chrome.tabs.executeScript(null, {
      file: 'content.js'
    })
    chrome.tabs.insertCSS(null, {
      file: 'style.css'
    })
  }

  // we have to check if they come from netflix.com -> netflix.com/watch
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    let url = changeInfo.url
    // only initialize if the url is the correct one
    if (url && url.includes(URL)) {
      init()
    }
  });
  // if we arrive at netflix.com/watch first
  chrome.webNavigation.onCompleted.addListener(() => {
    init()
  }, { url: [{ urlMatches: URL + '*' }] });
});