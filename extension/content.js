
function getCurrentBranch() {
  let branches = []
  document.querySelectorAll(".list-card-title").forEach(card => {
    let tag = card.textContent.match(/\[ADR-\d+\]/g)
    if (tag) branches.push(+tag[0].match(/\d+/g)[0])
  })
  let maxBranch = Math.max(...branches)
  let currentBranch = maxBranch + 1;
  return `[ADR-${currentBranch}] `;
}


setTimeout(() => {
  const addButtons = document.querySelectorAll(".open-card-composer")
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      let currentBranch = getCurrentBranch()
      setTimeout(() => {
        const cardInput = document.querySelector("textarea.list-card-composer-textarea")
        cardInput.textContent = currentBranch
      }, 100)
    })
  })
}, 4000)


