async function register(e){
e.preventDefault()
usernameInput.value;
passwordInput.value;
uploadInput.files[0];
const formData = new FormData()
formData.append("username",usernameInput.value)
formData.append("password",passwordInput.value)
formData.append("file",uploadInput.files[0])

const newUser = await axios.post("http://localhost:4545/api/register",formData)
if(newUser.data.status == 201){
    window.localStorage.setItem("accessToken",newUser.data.accessToken)
    window.localStorage.setItem("avatar",newUser.data.avatar)

    window.location = "/"
}
}

submitButton.onclick = register;