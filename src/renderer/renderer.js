
const mainButtonsContainer = document.getElementById("main-buttons");
// const aliases = ["wip", "get", "real", "ones", "from", "ipc"];
window.crowdControlMain.getAliases().then( aliases => {
  for (const alias of aliases) {
    const newLi = document.createElement("li");
    const newButton = document.createElement("button");
    newButton.textContent = alias;
    newButton.onclick = (event) => {
      window.crowdControlMain.doEffectFromAlias(alias);
    };
    newLi.appendChild(newButton);
    mainButtonsContainer.appendChild(newLi);
  }
})

// this is helper code for the tabs in the interface.
const tabs = document.getElementsByClassName("middle-tablink");
for (const tab of tabs) {
  tab.onclick = (event) => openTab(event, tab.dataset.tabname)
}

function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("active-tab");
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("middle-tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  // document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active-tab");
  evt.currentTarget.className += " active";
}
