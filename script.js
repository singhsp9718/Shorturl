const API_URL = "https://api.shrtco.de/v2/shorten?url=";  

let history = JSON.parse(localStorage.getItem("urlHistory")) || [];

function shortenUrl() {
    const longUrl = document.getElementById("longUrl").value;
    if (!longUrl) {
        alert("Please enter a valid URL.");
        return;
    }

    fetch(API_URL + encodeURIComponent(longUrl))
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                const shortUrl = data.result.short_link;
                document.getElementById("shortenedUrl").value = shortUrl;
                document.getElementById("shortenedUrlContainer").style.display = "block";

                history.push({ longUrl, shortUrl });
                localStorage.setItem("urlHistory", JSON.stringify(history));
                updateHistoryTable();
            } else {
                alert("Failed to shorten URL.");
            }
        })
        .catch(error => console.error("Error:", error));
}

function copyUrl() {
    const shortUrl = document.getElementById("shortenedUrl");
    shortUrl.select();
    document.execCommand("copy");
    alert("Shortened URL copied!");
}

function resetFields() {
    document.getElementById("longUrl").value = "";
    document.getElementById("shortenedUrlContainer").style.display = "none";
}

function updateHistoryTable() {
    const tableBody = document.querySelector("#historyTable tbody");
    tableBody.innerHTML = "";
    history.forEach(({ longUrl, shortUrl }) => {
        const row = `<tr><td>${longUrl}</td><td><a href="${shortUrl}" target="_blank">${shortUrl}</a></td></tr>`;
        tableBody.innerHTML += row;
    });
}

function downloadCSV() {
    let csv = "Original URL,Shortened URL\n";
    history.forEach(({ longUrl, shortUrl }) => {
        csv += `${longUrl},${shortUrl}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shortened_urls.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener("DOMContentLoaded", updateHistoryTable);