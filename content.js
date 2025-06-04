function matchesKeyword(text, keywords) {
  const lower = text.trim().toLowerCase();
  return keywords.some(k => lower.includes(k.trim().toLowerCase()));
}

function hideByKeywords(leftListItems, keywords) {
  leftListItems.forEach(li => {
    const titleNode = li.querySelector("strong");
    if (!titleNode) return;
    const titleText = titleNode.innerText || "";
    if (matchesKeyword(titleText, keywords)) {
      li.style.display = "none";
    }
  });
}

function parseDetailPane(detailRoot) {
  if (!detailRoot) return null;

  const titleEl = detailRoot.querySelector("h1 > a");
  const title = titleEl ? titleEl.innerText.trim() : null;
  if (!title) return null;

  const compEl = detailRoot.querySelector(
    "div.job-details-jobs-unified-top-card__company-name > a"
  );
  const company = compEl
    ? compEl.innerText.replace(/<!--[\s\S]*?-->/g, "").trim()
    : null;
  if (!company) return null;

  let applicants = -1;
  const spanContainer = detailRoot.querySelector("span[dir='ltr']");
  if (spanContainer) {
    for (let span of Array.from(spanContainer.children)) {
      const txt = (span.innerText || "").trim().toLowerCase();
      if (txt.includes("applicant") || txt.includes("clicked apply")) {
        const match = txt.match(/(\d+)/);
        if (match) {
          applicants = parseInt(match[1], 10);
        }
        break;
      }
    }
  }

  return { title, company, applicants };
}

function hideMatchingListItem(leftListItems, detailObj, applicantThreshold) {
  if (!detailObj || detailObj.applicants < applicantThreshold) return;
  const { title: dTitle, company: dCompany } = detailObj;

  leftListItems.forEach(li => {
    const liTitleNode = li.querySelector("strong");
    const liTitle = liTitleNode ? liTitleNode.innerText.trim() : null;
    const liCompanyNode = li.querySelector("span[dir='ltr']");
    const liCompany = liCompanyNode
      ? liCompanyNode.innerText.trim()
      : null;

    if (
      liTitle &&
      liCompany &&
      liTitle === dTitle &&
      liCompany === dCompany
    ) {
      li.style.display = "none";
    }
  });
}

chrome.storage.local.get(["filterKeywords", "applicantNumber"], (data) => {
  const keywords = Array.isArray(data.filterKeywords)
    ? data.filterKeywords
    : [];
  const applicantNumber =
    typeof data.applicantNumber === "number"
      ? data.applicantNumber
      : Infinity;

  function getLeftListItems() {
    const ulPosts = document.querySelector(
      "div.scaffold-layout__list > div > ul"
    );
    if (!ulPosts) return [];
    return Array.from(ulPosts.children);
  }

  function getDetailPane() {
    return document.querySelector("div.scaffold-layout__detail");
  }

  const leftItems = getLeftListItems();
  hideByKeywords(leftItems, keywords);

  const ul = document.querySelector("div.scaffold-layout__list > div > ul");
  if (ul) {
    new MutationObserver((mutations) => {
      const updatedLeft = getLeftListItems();
      hideByKeywords(updatedLeft, keywords);
    }).observe(ul, { childList: true });
  }

  const detailRoot = getDetailPane();
  if (detailRoot) {
    new MutationObserver((mutations) => {
      if (this._detailTimeout) clearTimeout(this._detailTimeout);
      this._detailTimeout = setTimeout(() => {
        const detailObj = parseDetailPane(getDetailPane());
        const allLeft = getLeftListItems();
        hideMatchingListItem(allLeft, detailObj, applicantNumber);
      }, 50);
    }).observe(detailRoot, { childList: true, subtree: true });
  }

  new MutationObserver((mutations) => {
    const allLeft = getLeftListItems();
    hideByKeywords(allLeft, keywords);

    const detailObj = parseDetailPane(getDetailPane());
    hideMatchingListItem(allLeft, detailObj, applicantNumber);
  }).observe(document.body, { childList: true, subtree: true });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  let didUpdate = false;

  if (changes.filterKeywords) {
    currentKeywords = Array.isArray(changes.filterKeywords.newValue)
      ? changes.filterKeywords.newValue
      : [];
    didUpdate = true;
  }

  if (changes.applicantNumber) {
    const newVal = changes.applicantNumber.newValue;
    currentApplicantLimit = typeof newVal === "number" ? newVal : Infinity;
    didUpdate = true;
  }

  if (didUpdate) {
    const allLeftItems = Array.from(
      document.querySelectorAll("div.scaffold-layout__list > div > ul > li")
    );
    allLeftItems.forEach(li => {
      li.style.display = "";
    });

    hideByKeywords(allLeftItems, currentKeywords);

    const detailObj = parseDetailPane(
      document.querySelector("div.scaffold-layout__detail")
    );
    hideMatchingListItem(allLeftItems, detailObj, currentApplicantLimit);
  }
});
