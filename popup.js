document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("keywordInput");
  const addButton = document.getElementById("addKeyword");
  const keywordList = document.getElementById("keywordList");

  chrome.storage.local.get(["filterKeywords"], function (data) {
    const keywords = data.filterKeywords || [];
    displayKeywords(keywords);
  });

  addButton.addEventListener("click", function () {
    const keyword = input.value.trim();
    if (keyword) {
      chrome.storage.local.get(["filterKeywords"], function (data) {
        let keywords = data.filterKeywords || [];

        if (!keywords.includes(keyword)) {
          keywords.push(keyword);

          displayKeywords(keywords);

          chrome.storage.local.set({ filterKeywords: keywords });
        }
      });
      input.value = "";
    }
  });

  function removeKeyword(keyword) {
    chrome.storage.local.get(["filterKeywords"], function (data) {
      const keywords = data.filterKeywords || [];
      const updatedKeywords = keywords.filter(k => k !== keyword);
      chrome.storage.local.set({ filterKeywords: updatedKeywords }, function () {
        displayKeywords(updatedKeywords);
      });
    });
  }

  function displayKeywords(keywords) {
    keywordList.innerHTML = "";
    keywords.forEach(keyword => {
      const listItem = document.createElement("li");
      listItem.textContent = keyword;
      const removeButton = document.createElement("button");
      removeButton.textContent = "❌";
      removeButton.className = "remove-btn";
      removeButton.onclick = () => removeKeyword(keyword);
      listItem.appendChild(removeButton);
      keywordList.appendChild(listItem);
    });
  }
});
