

async function login(){
    const res = await axios.post("http://localhost:4545/api/login",{
        username:usernameInput.value,
        password:passwordInput.value
    })
    console.log(
        res
    );
    
    if(res.data.status == 201){
        window.localStorage.setItem("accessToken",res.data.accessToken)
        window.localStorage.setItem("avatar",res.data.avatar)
        window.location = "/"

    }
}

submitButton.onclick = login