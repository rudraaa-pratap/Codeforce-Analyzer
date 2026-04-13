async function getData() {
    const handle = document.getElementById("handle").value;
    const resDiv = document.getElementById("result");

    resDiv.innerHTML = "Loading...";

    try {
        const res = await fetch(`/api/user/${handle}`);
        const data = await res.json();

        if (data.error) {
            resDiv.innerHTML = data.error;
            return;
        }

        let tagHTML = "";
        for (let tag in data.tags) {
            tagHTML += `<p>${tag}: ${data.tags[tag]}</p>`;
        }

        resDiv.innerHTML = `
  <div class="card">
    <h2>${data.handle}</h2>
    <p><strong>Rating:</strong> ${data.rating}</p>
    <p><strong>Max Rating:</strong> ${data.maxRating}</p>
    <p><strong>Contests:</strong> ${data.contests}</p>
    <p><strong>Solved:</strong> ${data.solved}</p>

    <h3>Tags</h3>
    <div class="tags">
      ${Object.entries(data.tags).map(
            ([tag, count]) => `<span>${tag}: ${count}</span>`
        ).join("")}
    </div>
  </div>
`;

    } catch (err) {
        resDiv.innerHTML = "Error fetching data";
    }
}