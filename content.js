// 텍스트 선택 시 자동 복사 기능
// background.js로부터 메시지 수신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showStatus") {
    // 화면에 상태 표시
    const notification = document.createElement("div");
    notification.textContent = "드래그 복사 우클릭 붙여넣기 활성화됨";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 10000;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.5s;
    `;

    document.body.appendChild(notification);

    // 알림을 2초 후에 제거
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 2000);

    sendResponse({ status: "success" });
  }
  return true;
});

document.addEventListener("mouseup", function (event) {
  // 좌클릭으로 텍스트를 선택한 경우에만 동작
  if (event.button === 0) {
    const selectedText = window.getSelection().toString().trim();
    // 선택된 텍스트가 있을 경우에만 복사
    if (selectedText) {
      // 클립보드에 복사
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          // 선택 상태를 유지하기 위해 선택을 취소하지 않음
          console.log("텍스트가 클립보드에 복사되었습니다: ", selectedText);

          // 시각적 피드백 (옵션)
          const notification = document.createElement("div");
          notification.textContent = "복사됨!";
          notification.style.cssText = `
            position: fixed;
            top: ${event.clientY - 30}px;
            left: ${event.clientX + 10}px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.5s;
          `;

          document.body.appendChild(notification);

          // 알림을 1초 후에 제거
          setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 500);
          }, 1000);
        })
        .catch((err) => {
          console.error("클립보드 복사 실패: ", err);
        });
    }
  }
});

// 우클릭 시 붙여넣기 기능
document.addEventListener("contextmenu", function (event) {
  // 텍스트 입력 영역에서만 동작하도록 함
  const isTextField =
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.isContentEditable;

  if (isTextField) {
    // 기본 컨텍스트 메뉴를 방지
    event.preventDefault();

    // 클립보드에서 텍스트 읽어오기
    navigator.clipboard
      .readText()
      .then((text) => {
        // 텍스트가 있는 경우에만 붙여넣기
        if (text) {
          // 현재 선택된 영역 또는 커서 위치에 텍스트 삽입
          if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
          ) {
            // input, textarea 요소의 경우
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            const value = event.target.value;

            event.target.value =
              value.substring(0, start) + text + value.substring(end);
            event.target.selectionStart = event.target.selectionEnd =
              start + text.length;

            // input 이벤트 발생시키기 (일부 웹사이트의 JS가 이를 감지함)
            const inputEvent = new Event("input", { bubbles: true });
            event.target.dispatchEvent(inputEvent);
          } else if (event.target.isContentEditable) {
            // contentEditable 요소의 경우
            document.execCommand("insertText", false, text);
          }

          console.log("텍스트가 붙여넣기 되었습니다.");
        }
      })
      .catch((err) => {
        console.error("클립보드 읽기 실패: ", err);
      });
  }
});
