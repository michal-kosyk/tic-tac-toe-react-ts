const App = {
  $: {
    menu: document.querySelector(".menu"),
    menuButton: document.querySelector(".menu-btn"),
    menuItems: document.querySelector(".items"),
  },

  init() {
    App.$.menuButton.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
  },
};

window.addEventListener("load", App.init);
