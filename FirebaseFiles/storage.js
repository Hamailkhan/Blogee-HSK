import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

import { storage } from "../firebaseConfig.js";
import { writeUserData, title, description } from "../createBlog/createBlog.js";

const uploadBlogImage = (fileName, fileData, metadata) => {
  const storageRef = ref(storage, "blogImg/" + fileName);
  const uploadTask = uploadBytesResumable(storageRef, fileData, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          // console.log("User doesn't have permission to access the object");
          break;

        case "storage/unknown":
          // console.log("Unknown error occurred, inspect error.serverResponse");
          break;
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((imageURL) => {
        writeUserData(title.value, description.value, imageURL);
      });
    }
  );
};

export { uploadBlogImage, ref };
