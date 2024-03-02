document.body.style.overflow = "hidden";

const loadCon = document.getElementById("load");

window.addEventListener("load", () => {
  loadCon.remove();
  document.body.style.overflow = "auto";
});

const createBlogBtn = document.getElementById("createBlogBtn");

if (createBlogBtn) {
  window.addEventListener("resize", () => {
    if (window.innerWidth < 425) {
      createBlogBtn.innerHTML = `<svg
      xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>`;
      createBlogBtn.classList.add("btn-square");
    } else {
      createBlogBtn.innerHTML = `Create Blog`;
      createBlogBtn.classList.remove("btn-square");
    }
  });

  window.addEventListener("load", () => {
    if (window.innerWidth < 425) {
      createBlogBtn.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>`;
      createBlogBtn.classList.add("btn-square");
    } else {
      createBlogBtn.innerHTML = `Create Blog`;
      createBlogBtn.classList.remove("btn-square");
    }
  });
}
