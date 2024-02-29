import {
  load,
  logout,
  storage,
  auth,
  updateProfile,
} from "../firebaseConfig.js";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const profileLogout = document.querySelector(".profile .btn");
const logoutBtn = document.getElementById("logout");

const profileImg = document.getElementById("profileImg");
const img = document.getElementById("img");
const username = document.getElementById("username");
const useremail = document.getElementById("useremail");
const fileInput = document.getElementById("fileInput");
const usernameEdit = document.getElementById("usernameEdit");
const loadCon = document.getElementById("loadForm");
const inputContainer = document.getElementById("inputContainer");
const newUsername = document.getElementById("newUsername");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const alertCheckbox = document.querySelector(".alertCheckbox");
const alertMess = document.getElementById("alertMess");

load(img, profileImg, username, useremail);

logout(profileLogout);
logout(logoutBtn);

fileInput.addEventListener("change", ({ target }) => {
  loadCon.classList.remove("noneForm");
  let imgIsOk;
  let url;
  let fileData = target.files[0];

  if (fileData.type.startsWith("image/")) {
    url = URL.createObjectURL(fileData);
    imgIsOk = true;
    img.setAttribute("src", url);
    profileImg.setAttribute("src", url);
  } else {
    loadCon.classList.add("noneForm");
    alertMess.innerHTML = "File format not supported!";
    alertCheckbox.click();
    imgIsOk = false;
  }

  const metadata = {
    name: fileData.name,
    size: fileData.size,
    type: fileData.type,
  };

  if (imgIsOk) {
    const fileName = `${Date.now()}_${fileData.name}`;

    const storageRef = ref(storage, "userProfle/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, fileData, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((imageURL) => {
          updateProfile(auth.currentUser, {
            photoURL: imageURL,
          })
            .then(() => {
              loadCon.classList.add("noneForm");
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    );
  }
});

usernameEdit.addEventListener("click", () => {
  inputContainer.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  inputContainer.classList.remove("active");
  setTimeout(() => {
    newUsername.value = "";
  }, 500);
});

saveBtn.addEventListener("click", () => {
  if (newUsername.value.trim() === "") {
    alertMess.innerHTML = "Username Reqiured!";
    alertCheckbox.click();
  } else if (newUsername.value.trim().length < 4) {
    alertMess.innerHTML =
      "Please enter at least 4 characters for the username!";
    alertCheckbox.click();
  } else if (!/^[a-zA-Z]+$/.test(newUsername.value)) {
    alertMess.innerHTML =
      "Please enter only alphabet characters for the username!";
    alertCheckbox.click();
  } else {
    loadCon.classList.remove("noneForm");
    updateProfile(auth.currentUser, {
      displayName: newUsername.value,
    })
      .then(() => {
        loadCon.classList.add("noneForm");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
