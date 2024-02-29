import {
  load,
  logout,
  currentUserId,
  rdb,
  currentUser,
  currentUserImg,
} from "../firebaseConfig.js";

import {
  ref,
  set,
  get,
  child,
  onChildAdded,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const img = document.getElementById("img");
load(img);

const logoutBtn = document.getElementById("logout");
logout(logoutBtn);

const blogTitle = document.getElementById("blogTitle");
const blogDes = document.getElementById("blogDes");
const imgPreview = document.getElementById("imgPreview");
const blogDate = document.getElementById("blogDate");
const user = document.getElementById("user");

let id = window.location.href.split("?id=").pop();
const figure = document.querySelector(".image");

const getBlog = async () => {
  get(child(ref(rdb), `blogs/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let blogData = snapshot.val();

        let title = blogData.title;
        let username = blogData.currentUser;
        let blogImg = blogData.blogPicture;
        let date = blogData.date;
        let des = blogData.description;

        blogTitle.innerHTML = title;
        blogDes.innerHTML = des;
        imgPreview.src = blogImg;
        blogDate.innerHTML = `Date: ${date}`;
        user.innerHTML = `Published By: ${username}`;
        figure.classList.remove("skeleton");
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

getBlog();

const commentBtn = document.getElementById("commentBtn");
const commentCon = document.getElementById("allComments");
const form = document.getElementById("form");
const comment = document.getElementById("comment");

let timeStamp = new Date().getTime();

const likeFunc = (val, commId) => {
  let uid = `${currentUserId}`;
  try {
    set(ref(rdb, `blogsLikes/${id}/${commId}/${uid}`), {
      id,
      like: val,
    });
  } catch (error) {
    console.error(error);
  }
};

const writeUserComment = async () => {
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let hours = new Date().getHours();
  let min = new Date().getMinutes();
  let convertedMonth;
  let convertedHours = hours;
  let editCommentsHour;
  let editCommentsMin;

  switch (hours) {
    case "00" || 0:
      convertedHours = 12;
      break;
    case 13:
      convertedHours = 1;
      break;
    case 14:
      convertedHours = 2;
      break;
    case 15:
      convertedHours = 3;
      break;
    case 16:
      convertedHours = 4;
      break;
    case 17:
      convertedHours = 5;
      break;
    case 18:
      convertedHours = 6;
      break;
    case 19:
      convertedHours = 7;
      break;
    case 20:
      convertedHours = 8;
      break;
    case 21:
      convertedHours = 9;
      break;
    case 22:
      convertedHours = 10;
      break;
    case 23:
      convertedHours = 11;
      break;
    case 24:
      convertedHours = 12;
      break;

    default:
      convertedHours = hours;
      break;
  }

  if (convertedHours > 9) {
    editCommentsHour = convertedHours;
  } else {
    editCommentsHour = `0${convertedHours}`;
  }

  if (min > 9) {
    editCommentsMin = min;
  } else {
    editCommentsMin = `0${min}`;
  }

  let time = `${editCommentsHour}:${editCommentsMin}`;

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

  let uid = `${new Date().getTime()}-${currentUserId}`;

  try {
    set(ref(rdb, `comments/${id}/${uid}`), {
      id,
      userId: currentUserId,
      uid,
      comment: comment.value,
      currentUser,
      currentUserImg,
      time,
      date: fullDate,
    });
  } catch (error) {
    console.error(error);
  }
};

// ?

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

commentBtn.addEventListener("click", () => {
  if (comment.value.trim() !== "") {
    writeUserComment();
    comment.value = "";
  }
});

comment.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (comment.value.trim() !== "") {
      writeUserComment();
      comment.value = "";
    }
  }
});

onChildAdded(ref(rdb, `comments/${id}/`), (data) => {
  let Commentdata = data.val();

  let user = Commentdata.currentUser;
  let userImg = Commentdata.currentUserImg;
  let date = Commentdata.date;
  let time = Commentdata.time;
  let comment = Commentdata.comment;
  let blogId = Commentdata.id;
  let commentId = Commentdata.uid;

  if (id === blogId) {
    const getLike = () => {
      get(child(ref(rdb), `blogsLikes/${id}/${commentId}/${currentUserId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            let getting = snapshot.val();
            let isLike = getting.like;
            if (isLike === true) {
              let commentHtml = `
        <div class="user">
          <div class="top">
            <div class="userInfo">
              <div class="userImg">
                <img src="${userImg}" alt="profile" />
              </div>
              <div class="username">${user}</div>
            </div>
            <i title="I Like This" class="like likeBtn bx bxs-like" data-id="${commentId}"></i>
          </div>
          <div class="middle">
            <p class="userComment">${comment}</p>
          </div>
          <div class="bottom">
            <div class="date">${date}</div>
            <div class="time">${time}</div>
          </div>
      </div>`;
              commentCon.insertAdjacentHTML("afterbegin", commentHtml);
            } else if (isLike === false) {
              let commentHtml = `
        <div class="user">
          <div class="top">
            <div class="userInfo">
              <div class="userImg">
                <img src="${userImg}" alt="profile" />
              </div>
              <div class="username">${user}</div>
            </div>
            <i title="I Like This" class="like likeBtn bx bx-like" data-id="${commentId}"></i>
          </div>
          <div class="middle">
            <p class="userComment">${comment}</p>
          </div>
          <div class="bottom">
            <div class="date">${date}</div>
            <div class="time">${time}</div>
          </div>
      </div>`;
              commentCon.insertAdjacentHTML("afterbegin", commentHtml);
            }
          } else {
            let commentHtml = `
        <div class="user">
          <div class="top">
            <div class="userInfo">
              <div class="userImg">
                <img src="${userImg}" alt="profile" />
              </div>
              <div class="username">${user}</div>
            </div>
            <i title="I Like This" class="like likeBtn bx bx-like" data-id="${commentId}"></i>
          </div>
          <div class="middle">
            <p class="userComment">${comment}</p>
          </div>
          <div class="bottom">
            <div class="date">${date}</div>
            <div class="time">${time}</div>
          </div>
      </div>`;
            commentCon.insertAdjacentHTML("afterbegin", commentHtml);
          }
          const likeBtn = document.querySelector(".likeBtn");

          likeBtn.addEventListener("click", ({ target }) => {
            if (target.classList.contains("bxs-like")) {
              target.classList.replace("bxs-like", "bx-like");
              likeFunc(false, target.getAttribute("data-id"));
            } else if (target.classList.contains("bx-like")) {
              target.classList.replace("bx-like", "bxs-like");
              likeFunc(true, target.getAttribute("data-id"));
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    getLike();
  }
});
