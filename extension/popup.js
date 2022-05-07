let branchTemplate = document.getElementById("branchTemplate");
let branchesContainer = document.getElementById("branchesContainer");
let syncBtn = document.getElementById("sync");


syncBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: syncBranches,
    },
    () => {
      renderBranches();
    }
  );
});

function syncBranches() {
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
    chrome.storage.local.set({ branches: JSON.stringify([...branches]) });
  }
  updateBranches();
}

renderBranches();

function renderBranches() {
  chrome.storage.local.get("branches", async (result) => {
    branchesContainer.innerHTML = "";
    let branches = JSON.parse(result.branches);
    let currentBranch = await chrome.storage.local.get("activeBranch");
    branches.forEach((branch) => {
      branchesContainer.innerHTML += `
        <div class="branch ${
          branch == currentBranch.activeBranch ? "active" : ""
        }" >
        ${branch} 
        </div>
      `;
    });

    let branchesDivs = branchesContainer.querySelectorAll(".branch");
    if (branchesDivs.length > 0) {
      branchesDivs.forEach((branch) => {
        branch.addEventListener("click", () => {
          chrome.storage.local.set({ activeBranch: branch.textContent.trim() });
          branchesDivs.forEach((br) => {
            br.classList.remove("active");
          });

          branch.classList.add("active");
        });
      });
    }
  });
}

function setActiveBranch(branch) {
  chrome.storage.local.set({ activeBranch: branch });
  let branchesDivs = document.querySelectorAll(".branch");
  if (branchesDivs.length > 0) {
    branchesDivs.forEach((branch) => {
      branch.classList.remove("active");
    });
    branch.classList.add("active");
  }
}
