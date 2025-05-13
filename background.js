// background.js
// 확장 프로그램이 설치되거나 업데이트될 때 실행됩니다

// 확장 프로그램 설치/업데이트 시 초기화
chrome.runtime.onInstalled.addListener(() => {
  console.log("드래그 복사 우클릭 붙여넣기 확장 프로그램이 설치되었습니다.");

  // 확장 프로그램 아이콘 클릭 시 상태 알림
  chrome.action.onClicked.addListener(() => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon128.png",
      title: "드래그 복사 우클릭 붙여넣기",
      message: "확장 프로그램이 활성화되어 있습니다.",
    });
  });
});
