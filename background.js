chrome.runtime.onInstalled.addListener(() => {
  console.log("The DragCopyPaste extension has been installed.");

  chrome.action.onClicked.addListener(() => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "DragCopyPaste",
      message: "The extension is enabled.",
    });
  });
});
