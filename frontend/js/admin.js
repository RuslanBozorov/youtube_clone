function logoutBtn() {
  window.localStorage.clear();
  window.location = "/login";
}

const token = window.localStorage.getItem("accessToken");
if (!token) {
  alert("Video qo'sholmisan");
  window.location = "./login";
}

async function createFile(e) {
  try {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("title", videoInput.value);
    formdata.append("file", uploadInput.files[0]);

    console.log(videoInput.value);
    console.log(uploadInput.files[0]);
    const newFile = await axios.post(
      "http://localhost:4545/api/files",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (newFile.data.status == 201) {
      alert("video qo'shildi");
    }
    getAllFiles()
  } catch (error) {
    console.log(error);
  }
}

async function getFiles() {
  const res = await axios.get("http://localhost:4545/api/files/oneUser", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const files = res.data.files;

  videosList.innerHTML = files
    .map(
      (el) =>
        `
    
    <li class="video-item ">
        <video controls="true" src="http://localhost:4545/file/${el.file_name}"></video>
        <p class="content" contenteditable="true">${el.title}</p>
        <img class="delete-icon" src="http://localhost:4545/file/delete.png" width="25" onclick=deleteFile(${el.id})>
        
    </li>

    `
    )
    .join("");
}

async function deleteFile(id) {
  try {
    const res = await axios.delete(`http://localhost:4545/api/files/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status == 200) {
      getFiles();
      alert(res.data.message);
    }
  } catch (error) {
    console.log(error.message);
  }
}

getFiles();

submitButton.onclick = createFile;
