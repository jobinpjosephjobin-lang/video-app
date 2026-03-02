function loadURL() {
    const url = document.getElementById("urlInput").value;
    const viewer = document.getElementById("viewer");

    if (!url) {
        alert("Please paste a URL");
        return;
    }

    try {
        viewer.src = url;
    } catch (error) {
        window.open(url, "_blank");
    }
}
