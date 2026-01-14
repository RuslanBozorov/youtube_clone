function logoutBtn(){
    window.localStorage.clear()
    window.location = "/login"
}

const token = window.localStorage.getItem("accessToken")
if(!token){
    alert("Video qo'sholmisan")
}
 




async function createFile(e){
   try {
     e.preventDefault()
    let formdata = new FormData()
formdata.append("title",videoInput.value)
formdata.append("file",uploadInput.files[0])

console.log(videoInput.value);
console.log(uploadInput.files[0]);
    const newFile = await axios.post("http://localhost:4545/api/files",formdata,{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })
    if(newFile.data.status == 201){
        alert("video qo'shildi")
    }
    
   } catch (error) {
    console.log(error);
    
   }
}

submitButton.onclick = createFile