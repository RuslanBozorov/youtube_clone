const token = window.localStorage.getItem("accessToken")


if(!token){
  window.location = "/register"
}

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

const socket = io("http://localhost:4545", {
 auth:{
  headers:token
 },
  transports:["websocket"]
})

let lastUserId

socket.on("connect",()=>{
  console.log("front ulandi",socket.id);
})
const navbarList = document.querySelector(".navbar-list");
const iframesList = document.querySelector(".iframes-list");
const inputSearch = document.querySelector("#inputSearch");
const form = document.querySelector(".search-box");
const micBtn = document.querySelector(".micBtn")
const userId = document.querySelector(".data-id");
const list = document.querySelector("#list");
const chatBody = document.querySelector(".chat-body")
const chatHeader = document.querySelector(".chat-header")
  const avatar = window.localStorage.getItem("avatar");

  list.innerHTML += `
  <img class="avatar-img" src="http://localhost:4545/file/${
    avatar ? avatar : "avatar.jpg"
  }"  alt="avatar-img" width="32px" height="32px">
  `;
const date = new Date();
async function getUsers() {
  let users = await axios.get("http://localhost:4545/api/users");
  users = users.data.data;
  for (const user of users) {
    navbarList.innerHTML += `<li onclick=clickUser(${user.id},'${user.username}','${user.avatar}') class="channel" data-id="${user.id}">
      <a href="#">
        <img src="http://localhost:4545/file/${user.avatar}" alt="channel-icon" width="30" height="30">
        <span>${user.username}</span>
      </a>
    </li> `;
  }
}

let search = "";
function voice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition();
  recognition.start();
  recognition.lang = "uz-UZ";

  recognition.onresult = (e) => {
    search = e.results[0][0].transcript;
    inputSearch.value = search;
    getAllFiles();
  };
}

inputSearch.onkeydown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault()
    iframesList.innerHTML = ""
    search = inputSearch.value;
    getAllFiles();
  }
};

async function getAllFiles() {
  try {
    iframesList.innerHTML = "";
    let files = await axios.get(
      `http://localhost:4545/api/files/all?${search ? "title=" + search : ""}`
    );

    files = files.data.files;
    files.forEach((f) => {
      const year = new Date(f.created_at).getFullYear();
      const month = String(new Date(f.created_at).getMonth() + 1).padStart(2,"0");
      const day = String(new Date(f.created_at).getDate()).padStart(2,"0");
      const hour = new Date(f.created_at).getHours();
      const minut = String(new Date(f.created_at).getMinutes()).padStart(2,"0");

      iframesList.innerHTML += `<li class="iframe">
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
                  </li>`;
    });
  } catch (error) {
    console.log("Xatolik", error);
  }
}

async function getUserId(id) {
  clear();
  try{
    const res = await axios.get(`http://localhost:4545/api/files/${+id}`);
    const files = res.data?.files || [];
    files.forEach((f) => {
      const year = new Date(f.created_at).getFullYear();
      const month = String(new Date(f.created_at).getMonth() + 1).padStart(2,"0");
      const day = String(new Date(f.created_at).getDate()).padStart(2,"0");
      const hour = new Date(f.created_at).getHours();
      const minut = String(new Date(f.created_at).getMinutes()).padStart(2,"0");

      iframesList.innerHTML += `<li class="iframe">
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
                    </li>`;
    });
  } catch(err){

    console.log("Xatolik", err);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getAllFiles();
});

navbarList.addEventListener("click", (e) => {
  const channel = e.target.closest(".channel");
  if (!channel) return;
  const id = channel.dataset.id;
  if (id) getUserId(id);
});

micBtn.addEventListener("click",()=>{
  voice()
})

function clear() {
  iframesList.innerHTML = "";
}

function scrollToBottom() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function clickUser(user_id_to,username,avatar){
 chatHeader.innerHTML = `
 <img id="chatUserAvatar" src="http://localhost:4545/file/${avatar}""> 
  <span id="chatUserName">${username}</span> `

lastUserId=user_id_to
let messages = await axios.get("http://localhost:4545/api/message/" + user_id_to,{
  headers:{
    "Authorization":"Bearer " + token
  }
})
 messages = messages.data.message;

for (const message of messages) {
  if(message.user_id_to == user_id_to){
    chatBody.innerHTML+=`
  <div class="message me">
            ${message.message}
  </div> 
  `
  }else{
    chatBody.innerHTML+=`
  <div class="message other">
            ${message.message}
  </div>

        
  `
  }
}



}

function scrollToBottom(){
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendMessage(){
  if(mediaInput.files.length){
    const formdata = new FormData()
    formdata.append("file", mediaInput.files[0])
    

    const res = await axios.post(
      "http://localhost:4545/api/message/" + lastUserId,
      formdata,
      { headers: { Authorization: "Bearer " + token } }
    )


    chatInput.value = ""
  } else {
    const formdata = new FormData()
    formdata.append("text", chatInput.value)

    const res = await axios.post(
      "http://localhost:4545/api/message/" + lastUserId,
      formdata,
      { headers: { Authorization: "Bearer " + token } }
    )

    if(res.status === 201){
      chatBody.innerHTML += `
        <div class="message me">
          ${chatInput.value}
        </div> 
      `
      chatInput.value = ""
    }
  }
}

getUsers();
getAllFiles();

socket.on("send_message", (msg,mimetype) => {
  const type = (mimetype || "").split("/")[0];
  if(type === "image"){
    chatBody.innerHTML += `
    <div class="message other">
      <img width=300 src="http://localhost:4545/file/${msg}?media=true">
    </div> 
  `
  }else if(type === "video"){
    chatBody.innerHTML += `
    <div class="message other">
      <video controls width=300 src="http://localhost:4545/file/${msg}?media=true">
    </div> 
  `
  }
  
  else{
    chatBody.innerHTML += `
    <div class="message other">
      ${msg}
    </div> 
  `
  scrollToBottom()
  }
  
})
