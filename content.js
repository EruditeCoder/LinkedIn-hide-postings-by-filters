function removeJobPosts(keywords, applicantNumber = Infinity) {
  if (keywords.length == 0 && applicantNumber == Infinity) return;
  console.log("Start of program");
  
  // left side posts section
  const ulPosts = document.querySelector("div.scaffold-layout__list > div > ul");
  const liTags = Array.from(ulPosts.children);
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

    // right side posting detail section
    const detailsDivTag = document.querySelector("div.scaffold-layout__detail");
    if (detailsDivTag) {
      const detailsSimplifiedDivTag = detailsDivTag.querySelector("span[dir='ltr']");
      const spanDetailsTags = Array.from(detailsSimplifiedDivTag.children);

      spanDetailsTags.forEach((span) => {
        const detailText = span.innerText.trim().toLowerCase();
        if (detailText.includes("applicants") || detailText.includes("clicked apply")) {
          const applicants = detailText.match(/(\d+)/) ? parseInt(detailText.match(/(\d+)/)) : -1;
          
          if (applicants >= applicantNumber) {
            const titleDetailsTag = detailsDivTag.querySelector("h1 > a");
            const titleDetails = titleDetailsTag ? titleDetailsTag.innerHTML : "";
            const companyNameDetailsTag = detailsDivTag.querySelector("div.job-details-jobs-unified-top-card__company-name > a") || "";
            const companyNameDetails = companyNameDetailsTag ? (companyNameDetailsTag.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim()) : "";
            
            const companyNamePostTag = li.querySelector("span[dir='ltr']");
            const companyNamePost = companyNamePostTag ? companyNamePostTag.innerText.trim() : "";

            const titlePost = strong.innerText;

            console.log("titleDetails", titleDetails);
            console.log("companyNameDetails", companyNameDetails);

            console.log("titlePost", titlePost);
            console.log("companyNamePost", companyNamePost);
            
            if (titleDetails == titlePost && companyNameDetails == companyNamePost) {
              li.style.display = "none";
              console.log('removed li 😩');
              
            }
          }
        }
      })
    }
  });
}

chrome.storage.local.get(["filterKeywords", "applicantNumber"], function (data) {
  const keywords = data.filterKeywords || [];
  const applicantNumber = data.applicantNumber || Infinity;
  removeJobPosts(keywords, applicantNumber);

  const observer = new MutationObserver(() => removeJobPosts(keywords, applicantNumber));
  observer.observe(document.body, { childList: true, subtree: true });
});
