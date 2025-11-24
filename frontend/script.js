document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("zipfile");
    const formData = new FormData();
    formData.append("zipfile", fileInput.files[0]);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
    });

    const json = await response.json();

    if (json.success) {
        document.getElementById("result").innerHTML =
            `<a href="${json.report_url}" target="_blank">View Report</a>`;
    } else {
        document.getElementById("result").innerHTML = 
            "Error: " + json.error;
    }
});
