async function getCurrentBranch() {
  let branch = await chrome.storage.local.get("activeBranch");
  branch = branch.activeBranch;
  if (!branch) {
    branch = "ADR";
  }
  let branches = [];
  document.querySelectorAll(".list-card-title").forEach((card) => {
    let re = new RegExp(`\\[${branch}-\\d+\\]`, "g");
    let tag = card.textContent.match(re);
    if (tag) branches.push(+tag[0].match(/\d+/g)[0]);
  });
  let maxBranch = Math.max(...branches);
  let currentBranch = maxBranch + 1;
  return `[${branch}-${currentBranch}] `;
}

function getBranchesList() {
  let branchesNames = new Set();
  document.querySelectorAll(".list-card-title").forEach((card) => {
    let branch = card.textContent.match(/\[\w+-\d+\]/g);
    if (branch) branchesNames.add(branch[0].match(/\w+/g)[0]);
  });
  return branchesNames;
}

function updateBranches() {
  let branches = getBranchesList();
  chrome.storage.local.set(
    { branches: JSON.stringify([...branches]) },
    function() { }
  );
}

function StartApp() {
  const addButtons = document.querySelectorAll(".open-card-composer");
  addButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      let currentBranch = await getCurrentBranch();
      setTimeout(() => {
        const cardInput = document.querySelector(
          "textarea.list-card-composer-textarea"
        );
        cardInput.textContent = currentBranch;
      }, 100);
    });
  });
}
updateBranches();


var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    StartApp();
  }
}, 10);
