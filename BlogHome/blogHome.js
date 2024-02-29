import { load, logout, rdb, onChildAdded, ref } from "../firebaseConfig.js";

const desBlog = document.querySelectorAll(".desBlog");

desBlog.forEach((blogDes) => {
  let desHtml = blogDes.innerHTML;
  if (blogDes.innerHTML.length >= 250) {
    desHtml = blogDes.innerHTML.slice(0, 250) + ".....";
    blogDes.innerHTML = desHtml;
  }
});

const titleBlog = document.querySelectorAll(".card-title");

titleBlog.forEach((blogTitle) => {
  let titleHtml = blogTitle.innerHTML;
  if (blogTitle.innerHTML.length > 80) {
    titleHtml = blogTitle.innerHTML.slice(0, 80) + ".....";
    blogTitle.innerHTML = titleHtml;
  }
});

const img = document.getElementById("img");
load(img);

const logoutBtn = document.getElementById("logout");
logout(logoutBtn);

const card = document.getElementById("con");

onChildAdded(ref(rdb, "blogs/"), (data) => {
  let blogData = data.val();

  let id = blogData.id;
  let title = blogData.title;
  let date = blogData.date;
  let description = blogData.description;
  let blogPicture = blogData.blogPicture;
  let BlogProfile = blogData.currentUserImg;
  let blogUser = blogData.currentUser;
  let titl = title;
  let des = description;

  if (description.length >= 250) {
    des = description.slice(0, 250) + ".....";
  } else {
    des = description;
  }

  if (title.length >= 60) {
    titl = title.slice(0, 60) + ".....";
  } else {
    titl = title;
  }

  if (window.innerWidth >= 720) {
    let cardHtml = `
    <div class="card card-side bg-base-100 shadow-xl co" id="card" >
    <figure class="widthGreater">
    <img
            src="${blogPicture}"
            alt="Movie"
          />
        </figure>
        <div class="card-body">
        <h2 class="card-title" id="bolgT">${titl}</h2>
          <p id="desBlog" class="desBlog">
           ${des}
          </p>
          <div class="card-actions justify-between pub">
            <div class="pubData">
              <span class="pubN">
                <div
                tabindex="0"
                role="button"
                class="avatar">
                <div class="w-10 rounded-full">
                <img
                id="pImg"
                alt="Tailwind CSS Navbar component"
                src="${BlogProfile}"
                />
                </div>
                </div>
                <p id='username'>
                ${blogUser}
                </p>
                </span>
                <br />
                <span class="date"> ${date}</span>
                </div>
                <button class="btn btn-primary" id="readMore" data-id="${id}">Read More</button>
                </div>
                </div>
                </div>
                </div>`;

    card.insertAdjacentHTML("afterbegin", cardHtml);

    const readMore = document.querySelectorAll("#readMore");

    readMore.forEach((read) => {
      read.addEventListener("click", (e) => {
        let id = e.target.getAttribute("data-id");
        window.location.href = `../BlogPreview/blogPreview.html?id=${id}`;
      });
    });
  } else {
    let cardHtml = `
 <div class="card w-96 bg-base-100 shadow-xl co" id="card">
   <figure>
     <img src="${blogPicture}" alt="Shoes" />
   </figure>
   <div class="card-body">
     <h2 class="card-title">${titl}</h2>
     <p>${des}</p>
     <div class="card-actions justify-between items-center pub">
       <div class="pubData">
         <span class="pubN">
           <div tabindex="0" role="button" class="avatar">
             <div class="w-10 rounded-full">
               <img
                 id="pImg"
                 alt="Tailwind CSS Navbar component"
                 src="${BlogProfile}"
               />
             </div>
           </div>
           <p id="username">${blogUser}</p>
         </span>
         <br />
         <span class="date"> ${date}</span>
       </div>
       <button class="btn btn-primary" id="readMore" data-id="${id}">
         Read More
       </button>
     </div>
   </div>
 </div>;

`;

    card.insertAdjacentHTML("afterbegin", cardHtml);

    const readMore = document.querySelectorAll("#readMore");

    readMore.forEach((read) => {
      read.addEventListener("click", (e) => {
        let id = e.target.getAttribute("data-id");
        window.location.href = `../BlogPreview/blogPreview.html?id=${id}`;
      });
    });
  }
});

const search = document.getElementById("search");

search.addEventListener("input", () => {
  let filter = document.getElementById("search").value.toUpperCase();

  let blog = document.querySelectorAll(".card");
  let l = document.querySelectorAll(".card-title");

  for (var i = 0; i <= l.length; i++) {
    try {
      const a = blog[i].querySelectorAll(".card-title")[0];

      let value = a.innerHTML || a.innerText || a.textContent;

      if (value.toUpperCase().indexOf(filter) > -1) {
        blog[i].style.display = "";
      } else {
        blog[i].style.display = "none";
      }
    } catch (error) {
      console.error(error);
    }
  }
});
