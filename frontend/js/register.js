const modal = document.getElementById("otpModal");
const backdrop = document.getElementById("otpBackdrop");
const form = document.getElementById("otpEmailForm");
const otpEmailInput = document.getElementById("otpEmail");
const submitButton = document.getElementById("submitButton");

// register inputlari (id larni HTML ga mosla)
const usernameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const otpInput = document.getElementById("otpInput")
const passwordInput = document.getElementById("passwordInput");
const uploadInput = document.getElementById("uploadInput");

// msg (HTML dagi p id)
const msg = document.getElementById("otpMsg");

// ✅ Modal open/close - register tashqarisida
document.getElementById("openOtpModal").onclick = () => {
  modal.classList.add("open");
  backdrop.classList.add("open");
};

document.getElementById("closeOtpModal").onclick = closeModal;
backdrop.onclick = closeModal;

function closeModal() {
  modal.classList.remove("open");
  backdrop.classList.remove("open");
}

// ✅ OTP send form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = otpEmailInput.value.trim();
  if (!email) return alert("Email kiriting!");

  msg.textContent = "Yuborilyapti...";
  msg.className = "modal-msg";

  try {
    const res = await axios.post("http://localhost:4545/send", { email });
    // axios response data:
    const data = res.data;

    if (res.status !== 200) {
      msg.textContent = data?.message || "Xatolik";
      msg.className = "modal-msg msg-err";
      return;
    }

    msg.textContent = "✅ Kod yuborildi!";
    msg.className = "modal-msg msg-ok";
  } catch (err) {
    msg.textContent = err?.response?.data?.message || "Serverga ulanishda xatolik";
    msg.className = "modal-msg msg-err";
  }
});

// ✅ Register (faqat register ishlari)
async function register(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("username", usernameInput.value.trim());
  formData.append("email", emailInput.value.trim());
  formData.append("otp", otpInput.value.trim());
  formData.append("password", passwordInput.value.trim());
  formData.append("file", uploadInput.files[0]);

  try {
    const res = await axios.post("http://localhost:4545/api/register", formData);
    const data = res.data;

    if (data.status === 201) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("avatar", data.avatar);
      window.location = "/";
    } else {
      alert(data.message || "Register xatolik");
    }
  } catch (err) {
    alert(err?.response?.data?.message || "Server xatolik");
  }
}

submitButton.onclick = register;
