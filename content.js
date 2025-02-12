function removeJobPosts(keywords) {
  if (!keywords || keywords.length === 0) return;

  const ulTags = document.querySelectorAll("ul");

  ulTags.forEach(ul => {
    const liTags = Array.from(ul.children);

    liTags.forEach(li => {
      const strong = li.querySelector("strong");

      if (strong) {
        const strongText = strong.innerText.trim().toLowerCase();
        keywords.forEach(keyword => {
          if (strongText.includes(keyword.toLowerCase())) {
            li.style.display = "none";
          }
        });
      }
    });
  });
}

chrome.storage.local.get(["filterKeywords"], function (data) {
  const keywords = data.filterKeywords || [];
  removeJobPosts(keywords);

  const observer = new MutationObserver(() => removeJobPosts(keywords));
  observer.observe(document.body, { childList: true, subtree: true });
});
