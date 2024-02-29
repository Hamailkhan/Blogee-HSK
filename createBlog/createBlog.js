import {
  load,
  logout,
  currentUser,
  currentUserId,
  currentUserImg,
  rdb,
} from "../firebaseConfig.js";

import {
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

import { uploadBlogImage } from "../FirebaseFiles/storage.js";

window.addEventListener("load", () => {
  document.body.style.pointerEvents = "auto";
});

const loadForm = document.getElementById("loadForm");

const img = document.getElementById("img");
load(img);

const logoutBtn = document.getElementById("logout");
logout(logoutBtn);

const save = document.getElementById("save");
const cancel = document.getElementById("cancel");

cancel.addEventListener("click", () => {
  window.history.back();
});

const FileInput = document.getElementById("FileInput");
const previewImg = document.getElementById("previewImg");
const uploadImgBtn = document.getElementById("uploadImgBtn");
const alertCheckbox = document.querySelector(".alertCheckbox");
const alertMess = document.getElementById("alertMess");
let url;
let fileData;
let imgIsOk = false;

FileInput.addEventListener("change", ({ target }) => {
  fileData = target.files[0];

  if (fileData.type.startsWith("image/")) {
    url = URL.createObjectURL(fileData);
    imgIsOk = true;
    previewImg.setAttribute("src", url);
    previewImg.style.display = "";
    uploadImgBtn.style.display = "none";
  } else {
    alertMess.innerHTML = "File Format Not Supported!";
    alertCheckbox.click();
    imgIsOk = false;
  }
});

const writeUserData = (title, description, blogPicture) => {
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let convertedMonth;

  switch (month) {
    case 0:
      convertedMonth = "Jan";
      break;
    case 1:
      convertedMonth = "Feb";
      break;
    case 2:
      convertedMonth = "Mar";
      break;
    case 3:
      convertedMonth = "Apr";
      break;
    case 4:
      convertedMonth = "May";
      break;
    case 5:
      convertedMonth = "Jun";
      break;
    case 6:
      convertedMonth = "Jul";
      break;
    case 7:
      convertedMonth = "Aug";
      break;
    case 8:
      convertedMonth = "Sep";
      break;
    case 9:
      convertedMonth = "Oct";
      break;
    case 10:
      convertedMonth = "Nov";
      break;
    case 11:
      convertedMonth = "Dec";
      break;

    default:
      break;
  }
  let fullDate = `${date}-${convertedMonth}-${year}`;

  try {
    let id = `${new Date().getTime()}-${currentUserId}`;

    set(ref(rdb, `blogs/${id}`), {
      id,
      title,
      description,
      blogPicture,
      currentUserImg,
      currentUser,
      date: fullDate,
    }).then(() => {
      window.location.href = "/BlogHome/blogHome.html";
    });
  } catch (error) {
    console.error(error);
  }
};

const title = document.getElementById("title");
const description = document.getElementById("description");

save.addEventListener("click", () => {
  loadForm.classList.remove("noneForm");
  if (title.value === "" || description.value === "" || imgIsOk === false) {
    loadForm.classList.add("noneForm");
    alertMess.innerHTML =
      "Please fill in all the required fields before proceeding!";
    alertCheckbox.click();
  } else {
    loadForm.classList.remove("noneForm");
    const metadata = {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
    };

    const fileName = `${Date.now()}_${fileData.name}`;

    uploadBlogImage(fileName, fileData, metadata);
  }
});

export { writeUserData, title, description };
