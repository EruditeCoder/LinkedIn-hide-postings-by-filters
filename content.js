function removeJobPosts(keywords, applicantNumber = Infinity) {
  if (!keywords) return;

  const ulTags = document.querySelectorAll("ul");

  ulTags.forEach(ul => {
    if (keywords.length > 0) {
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
    }
  });

  const ul = document.querySelector("ul.jobs-details-premium-insight__list");
  if (ul) {
    const liTag = ul.children[0];
    const span = liTag.querySelector("span");
    if (span && span.className.includes("jobs-premium-applicant-insights__list-num")) {
      const applicants = parseInt(span.innerText.trim().split(" ")[0]);
      if (applicants < applicantNumber) {
        liTag.style.display = "none";
      }
    }
  }

}

chrome.storage.local.get(["filterKeywords"], function (data) {
  const keywords = data.filterKeywords || [];
  removeJobPosts(keywords);

  const observer = new MutationObserver(() => removeJobPosts(keywords));
  observer.observe(document.body, { childList: true, subtree: true });
});
