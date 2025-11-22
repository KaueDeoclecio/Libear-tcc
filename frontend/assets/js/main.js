
document.querySelectorAll(".bottom-nav .nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        if (target) {
            window.location.href = target;
        }
    });
});


const googleBtn = document.getElementById("google-login");
if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        window.location.href = "http://localhost:3000/api/google"; 
    });
}