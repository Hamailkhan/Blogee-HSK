document.body.style.overflow = "hidden";

const loadCon = document.getElementById("load");

window.addEventListener("load", () => {
  loadCon.remove();
  document.body.style.overflow = "auto";
});
