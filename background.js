

chrome.tabs.onUpdated.addListener((tabId,changeInfo, tab) => {
    if(changeInfo.status === 'complete' && tab.url){
        chrome.tabs.sendMessage(tabId, {
            type: "NEW"
          });
    }
     
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    console.log('Storage area changed:', areaName);
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(`Storage key "${key}" changed. Old value:`, oldValue, 'New value:', newValue);
      
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { type: "STORAGE_CHANGED",key,newValue });
        });
      });
    }
  });