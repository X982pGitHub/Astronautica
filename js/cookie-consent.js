document.addEventListener("DOMContentLoaded", function() {
    const cookieConsent = document.querySelector("#cookieConsent");
    const cookieConsentAccept = document.querySelector("#cookieConsentAccept");
    const cookieConsentDeny = document.querySelector("#cookieConsentDeny");
    const cookieConsentLearnMore = document.querySelector("#cookieConsentLearnMore");

    cookieConsentAccept.addEventListener("click", function() {
        localStorage.setItem("cookieConsent", "accepted");
        cookieConsent.style.display = "none";
    });

    cookieConsentDeny.addEventListener("click", function() {
        localStorage.setItem("cookieConsent", "denied");
        cookieConsent.style.display = "none";
    });

    cookieConsentLearnMore.addEventListener("click", function() {
        window.open("cookie_policy.html", "_blank");
    });
})