chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showStatus") {
    const notification = document.createElement("div");
    notification.textContent = "DragCopyPaste is enabled";
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
  if (event.button === 0) {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          console.log("Text copied to clipboard: ", selectedText);

          const notification = document.createElement("div");
          notification.textContent = "Copied!";
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
          console.error("Clipboard Copy Failed: ", err);
        });
    }
  }
});

document.addEventListener("contextmenu", function (event) {
  const isTextField =
    event.target.tagName === "INPUT" ||
    event.target.tagName === "TEXTAREA" ||
    event.target.isContentEditable;

  if (isTextField) {
    event.preventDefault();

    navigator.clipboard
      .readText()
      .then((text) => {
        if (text) {
          if (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
          ) {
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            const value = event.target.value;

            event.target.value =
              value.substring(0, start) + text + value.substring(end);
            event.target.selectionStart = event.target.selectionEnd =
              start + text.length;

            const inputEvent = new Event("input", { bubbles: true });
            event.target.dispatchEvent(inputEvent);
          } else if (event.target.isContentEditable) {
            document.execCommand("insertText", false, text);
          }

          console.log("Text pasted.");
        }
      })
      .catch((err) => {
        console.error("Clipboard Read Failed: ", err);
      });
  }
});
