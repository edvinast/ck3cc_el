// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`

// const func = async () => {
//   const response = await window.versions.ping()
//   console.log(response) // prints out 'pong'
// }

// func()

// very basic setup for now while I get the business logic working
const buttonOne = document.getElementById("button-1")
buttonOne.onclick = function () {
  window.examples.doEffect({ effect_name: "give_100_gold" })
}
const buttonTwo = document.getElementById("button-2")
buttonTwo.onclick = function () {
  window.examples.doEffect({ effect_name: "give_50_to_150_gold" })
}
const buttonThree = document.getElementById("button-3")
buttonThree.onclick = function () {
  window.examples.doEffect({ effect_name: "add_courtier_with_name", params: { "name": "Ella" }})
}
const buttonFour = document.getElementById("button-4")
buttonFour.onclick = function () {
  window.examples.doEffect({ effect_name: "add_courtier_with_name", params: { "name": "Oomfie" }})
}

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
