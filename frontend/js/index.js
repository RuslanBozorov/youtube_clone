const navbarList = document.querySelector(".navbar-list");
const iframesList = document.querySelector(".iframes-list");
const inputSearch = document.querySelector("#inputSearch");
const btn = document.querySelector(".search-btn");
const userId = document.querySelector(".data-id");
const avatar = window.localStorage.getItem("avatar")
list.innerHTML += `
 <img class="avatar-img" src=http://localhost:4545/file/${avatar ? avatar : "../public/img/avatar.jpg"}  alt="avatar-img" width="32px" height="32px">
`
const date = new Date();
async function getUsers() {
  let users = await axios.get("http://localhost:4545/api/users");
  users = users.data.data;
  
  users.forEach(u => {
    // console.log(u);
    
    navbarList.innerHTML+=
    `<li class="channel"  onclick="getUserId(${u.id})">
      <a href="#">
        <img src="http://localhost:4545/file/${u.avatar}" alt="channel-icon" width="30" height="30">
        <span>${u.username}</span>
      </a>
    </li> `
  });
    
}

async function getAllFiles() {
  try {
    iframesList.innerHTML=""
  let files = await axios.get("http://localhost:4545/api/files/all");

  files = files.data.files;
  files.forEach(f => {
    console.log(f.users.avatar);
    
    const year = new Date(f.created_at).getFullYear()
    const month = String(new Date(f.created_at).getMonth()+1).padStart(2,"0")
    const day = String(new Date(f.created_at).getDate()).padStart(2,"0")
    const hour = new Date(f.created_at).getHours()
    const minut = String(new Date(f.created_at).getMinutes()).padStart(2,"0")
    
    iframesList.innerHTML+=
    `<li class="iframe">
        <video src="http://localhost:4545/file/${f.file_name}" controls=""></video>
                <div class="iframe-footer">
                    <img src="http://localhost:4545/file/${f.users.avatar}" alt="channel-icon">
                            <div class="iframe-footer-text">
                                <h2 class="channel-name">${f.users.name}</h2>
                                <h3 class="iframe-title">${f.title}</h3>
                                <time class="uploaded-time">${year}/${month}/${day} | ${hour}:${minut}</time>
                                 <a class="download" href="http://localhost:4545/api/file/download/${f.file_name}">
                                    <span>${f.size}MB</span>
                                    <img src="./img/download.png">
                                </a>
                            </div>                  
                        </div>
                  </li>`
  })
  } catch (error) {
    console.log("Xatolik",error);
    
  }
}

async function getFiles() {
    clear()
    let data = inputSearch.value.trim()
    if(!data){
      return getAllFiles()
    }
    console.log(data);
    const res = await axios.get(`http://localhost:4545/api/search/${encodeURIComponent(data)}`)
    const files = res.data.files || []


    // console.log(files);
    
    files.forEach(f => {
     const year = new Date(f.created_at).getFullYear()
    const month = String(new Date(f.created_at).getMonth()+1).padStart(2,"0")
    const day = String(new Date(f.created_at).getDate()).padStart(2,"0")
    const hour = new Date(f.created_at).getHours()
    const minut = String(new Date(f.created_at).getMinutes()).padStart(2,"0")
   
    iframesList.innerHTML+=
    `<li class="iframe">
        <video src="http://localhost:4545/file/${f.file_name}" controls=""></video>
                <div class="iframe-footer">
                    <img src="http://localhost:4545/file/${f.users.avatar}" alt="channel-icon">
                            <div class="iframe-footer-text">
                                <h2 class="channel-name">${f.users.name}</h2>
                                <h3 class="iframe-title">${f.title}</h3>
                                <time class="uploaded-time">${year}/${month}/${day} | ${hour}:${minut}</time>
                                 <a class="download" href="http://localhost:4545/api/file/download/${f.file_name}">
                                    <span>${f.size}MB</span>
                                    <img src="./img/download.png">
                                </a>
                            </div>                  
                        </div>
                  </li>`

} )}

async function getUserId(id){
    clear()
    const res = await axios.get(`http://localhost:4545/api/files/${id}`)
    const files = res.data?.files || []
    console.log(files);
    
    files.forEach(f => {
     const year = new Date(f.created_at).getFullYear()
    const month = String(new Date(f.created_at).getMonth()+1).padStart(2,"0")
    const day = String(new Date(f.created_at).getDate()).padStart(2,"0")
    const hour = new Date(f.created_at).getHours()
    const minut = String(new Date(f.created_at).getMinutes()).padStart(2,"0")
   
    iframesList.innerHTML+=
    `<li class="iframe">
        <video src="http://localhost:4545/file/${f.file_name}" controls=""></video>
                <div class="iframe-footer">
                    <img src="http://localhost:4545/file/${f.users.avatar}" alt="channel-icon">
                            <div class="iframe-footer-text">
                                <h2 class="channel-name">${f.users.name}</h2>
                                <h3 class="iframe-title">${f.title}</h3>
                                <time class="uploaded-time">${year}/${month}/${day} | ${hour}:${minut}</time>
                                <a class="download" href="http://localhost:4545/api/file/download/${f.file_name}">
                                    <span>${f.size}MB</span>
                                    <img src="./img/download.png">
                                </a>
                            </div>                  
                        </div>
                  </li>`

})}

btn.addEventListener("click", (e) => {
  e.preventDefault()
  getFiles()
});

inputSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getFiles();
  }
});

navbarList.addEventListener("click",(e) => {
  const home = e.target.closest(".home")
  if(home){
    getAllFiles()
    return
  }
  const channel = e.target.closest(".channel")
  if(!channel) return
  const id = channel.dataset.id;
  if(id) getUserId(id)
})

function clear(){
  iframesList.innerHTML=""
}




getUsers();
getAllFiles()