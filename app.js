import {
  updateProfile,
  storage,
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  deleteUser,
} from "./firebaseConfig.js";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");

const loadForm = document.getElementById("loadForm");

registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

const googleBtn = document.getElementById("googleBtn");

function load() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.emailVerified !== true) {
        alertMessLink.innerHTML = `Email confirmation link has been sent to "${user.email}". If you have clicked on the link, please click on "OK".`;
        alertCheckboxLink.click();
      } else {
        window.location.href = "/BlogHome/blogHome.html";
      }
    }
  });
}

load();

const google = () => {
  loadForm.classList.remove("noneForm");
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      load();
    })
    .catch((error) => {
      loadForm.classList.add("noneForm");
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
};

googleBtn.addEventListener("click", () => {
  google();
});

const userNameReg = document.getElementById("userNameReg");
const userImg = document.getElementById("file");
const emailLoginR = document.getElementById("emailLoginR");
const passwordLoginR = document.getElementById("passwordLoginR");
const submitBtn = document.getElementById("submitBtn");
const forms = document.querySelectorAll(".forms");
const previewImg = document.getElementById("previewImg");
const alertCheckbox = document.querySelector(".alertCheckbox");
const alertMess = document.getElementById("alertMess");
const alertCheckboxLink = document.querySelector(".alertCheckboxLink");
const alertMessLink = document.getElementById("alertMessLink");
const okForLink = document.getElementById("okForLink");
const cancelForLink = document.getElementById("cancelForLink");

let fileData;
let imgIsOk = false;
let url;
let imageForSave;

userImg.addEventListener("change", ({ target }) => {
  fileData = target.files[0];

  if (fileData.type.startsWith("image/")) {
    url = URL.createObjectURL(fileData);
    imgIsOk = true;
    previewImg.src = url;
  } else {
    previewImg.src = "./img/profile.jpg";
    alertMess.innerHTML = "File format not supported!";
    alertCheckbox.click();
    imgIsOk = false;
  }
});

forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
});

const register = (username, email, password, img) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      updateProfile(user, {
        displayName: username,
        photoURL: img,
      })
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });

      sendEmailVerification(user).then(() => {
        if (user.emailVerified !== false) {
          alertMessLink.innerHTML = `Email confirmation link has been sent to "${email}". If you have clicked on the link, please click "OK".`;
          alertCheckboxLink.click();
        }
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      loadForm.classList.add("noneForm");
      switch (error.code) {
        case "auth/invalid-email":
          alertMess.innerHTML = "Email is invalid!";
          alertCheckbox.click();
          break;

        case "auth/invalid-password":
          alertMess.innerHTML = "Password is invalid!";
          alertCheckbox.click();
          break;

        case "auth/email-already-in-use":
          alertMess.innerHTML = "Email already in use!";
          alertCheckbox.click();
          break;

        default:
          break;
      }
    });
};

okForLink.addEventListener("click", () => {
  window.location.reload();
});

cancelForLink.addEventListener("click", () => {
  deleteUser(auth.currentUser)
    .then(() => {
      alertCheckboxLink.click();
      alertCheckbox.click();
    })
    .catch((error) => {
      console.error(error);
    });
});

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const login = (email, password) => {
  if (email.trim() !== "" && password.trim() !== "") {
    loadForm.classList.remove("noneForm");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        load();
      })
      .catch((error) => {
        loadForm.classList.add("noneForm");
        const errorCode = error.code;
        const errorMessage = error.message;
        alertMess.innerHTML = "Email or Password is invalid!";
        alertCheckbox.click();
      });
  } else {
    alertMess.innerHTML = "Please fill in all fields!";
    alertCheckbox.click();
  }
};

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  login(loginEmail.value, loginPassword.value);
});

submitBtn.addEventListener("click", () => {
  if (userNameReg.value.trim() === "") {
    alertMess.innerHTML = "Username reqiured!";
    alertCheckbox.click();
  } else if (userNameReg.value.trim().length < 4) {
    alertMess.innerHTML =
      "Please enter at least 4 characters for the username!";
    alertCheckbox.click();
  } else if (!/^[a-zA-Z]+$/.test(userNameReg.value)) {
    alertMess.innerHTML =
      "Please enter only alphabet characters for the username!";
    alertCheckbox.click();
  } else if (emailLoginR.value.trim() === "") {
    alertMess.innerHTML = "Email reqiured!";
    alertCheckbox.click();
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLoginR.value)) {
    alertMess.innerHTML = "Please enter a valid email address!";
    alertCheckbox.click();
  } else if (passwordLoginR.value.trim() === "") {
    alertMess.innerHTML = "Password reqiured!";
    alertCheckbox.click();
  } else if (passwordLoginR.value.includes(" ")) {
    alertMess.innerHTML = "Password should not contain spaces!";
    alertCheckbox.click();
  } else if (passwordLoginR.value.trim().length < 6) {
    alertMess.innerHTML =
      "Please enter at least 6 characters for the password!";
    alertCheckbox.click();
  } else if (!imgIsOk) {
    alertMess.innerHTML = "Profile image reqiured!";
    alertCheckbox.click();
  } else {
    loadForm.classList.remove("noneForm");
    const metadata = {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
    };

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
          imageForSave = imageURL;
          register(
            userNameReg.value,
            emailLoginR.value,
            passwordLoginR.value,
            imageForSave
          );
        });
      }
    );
  }
});

//? For Styling

const allInputs = wrapper.querySelectorAll(".input-box input");

allInputs.forEach((inp) => {
  inp.addEventListener("focus", (e) => {
    e.target.parentNode.classList.add("inputActive");
  });
  inp.addEventListener("blur", (e) => {
    if (inp.value.trim() !== "") {
      e.target.parentNode.classList.add("inputActive");
    } else {
      e.target.parentNode.classList.remove("inputActive");
    }
  });
});
