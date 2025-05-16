// background.js
// 확장 프로그램이 설치되거나 업데이트될 때 실행됩니다

// 확장 프로그램 설치/업데이트 시 초기화
chrome.runtime.onInstalled.addListener(() => {
  console.log("The DragCopyPaste extension has been installed.");

  // 확장 프로그램 아이콘 클릭 시 상태 알림
  chrome.action.onClicked.addListener(() => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "DragCopyPaste",
      message: "The extension is enabled.",
    });
  });
});
