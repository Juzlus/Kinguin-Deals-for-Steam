chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'fetchData') {
      fetch(message.url)
          .then(response => response.json())
          .then(data => sendResponse({ success: true, data: data }))
          .catch(error => sendResponse({ success: false, error: error.toString() }));
      return true;
  }
});