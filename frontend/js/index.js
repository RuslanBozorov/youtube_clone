const navbarList = document.querySelector(".navbar-list");
const iframesList = document.querySelector(".iframes-list");
const inputSearch = document.querySelector("#inputSearch");
const btn = document.querySelector(".search-btn");
const userId = document.querySelector(".data-id");
const date = new Date();
async function getUsers() {
  let users = await axios.get("http://localhost:4545/api/users");

  users = users.data.data;

  navbarList.innerHTML = users
    .map(
      (u) => `
        <li class="channel" data-id="${u.id}">
      <a href="#">
        <img src="http://localhost:4545/file/${u.avatar}" alt="channel-icon" width="30" height="30">
        <span>${u.username}</span>
      </a>
    </li>
    `
    )
    .join("");
}

async function getAllFiles() {
  let files = await axios.get("http://localhost:4545/api/files/all");
  files = files.data.files;

  for (const el of files) {
    iframesList.innerHTML += `

       <li class="iframe">
                        <video src="http://localhost:4545/file/${
                          el.file_name
                        }" controls=""></video>
                        <div class="iframe-footer">
                            <img src="http://localhost:4545/file/${
                              el.users.avatar
                            }" alt="channel-icon">
                            <div class="iframe-footer-text">
                                <h2 class="channel-name">${el.users.name}</h2>
                                <h3 class="iframe-title">${el.title}</h3>
                                <time class="uploaded-time">${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDay()}</time>
                                <a class="download" href="#">
                                    <span>${el.size}MB</span>
                                    <img src="./img/download.png">
                                </a>
                            </div>                  
                        </div>
                        </li>   `;
  }
}

async function getFiles(title = "") {
  try {
    const url = title
      ? `http://localhost:4545/api/files/all?title=${encodeURIComponent(title)}`
      : `http://localhost:4545/api/files/all`;

    const res = await axios.get(url);
    const files = res.data.files;

    iframesList.innerHTML = files
      .map((el) => {
        const date = new Date(el.created_at);

        return `
        <li class="iframe">
          <video src="http://localhost:4545/file/${
            el.file_name
          }" controls></video>

          <div class="iframe-footer">
            <img src="http://localhost:4545/file/${
              el.users.avatar
            }" alt="channel-icon">

            <div class="iframe-footer-text">
              <h2 class="channel-name">${el.users.name}</h2>
              <h3 class="iframe-title">${el.title}</h3>

              <time class="uploaded-time">
                ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
              </time>

              <a class="download" href="http://localhost:4545/file/${
                el.file_name
              }" download>
                <span>${el.size} MB</span>
                <img src="./img/download.png">
              </a>
            </div>
          </div>
        </li>
      `;
      })
      .join("");
  } catch (err) {
    console.error("Xatolik:", err);
  }
}

btn.addEventListener("click", () => {
  getFiles(inputSearch.value.trim());
});

inputSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getFiles(inputSearch.value.trim());
  }
});

navbarList.addEventListener("click", (e) => {
  e.preventDefault();

  const channel = e.target.closest(".channel");
  if (!channel) return;

  const id = channel.dataset.id;

  getUserById(id);
});



getAllFiles();
getUsers();
getFiles();