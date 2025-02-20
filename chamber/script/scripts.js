document.addEventListener("DOMContentLoaded", function () {
    const directory = document.getElementById("directory");
    const gridViewBtn = document.getElementById("gridView");
    const listViewBtn = document.getElementById("listView");

    // Fetch and display members
    async function loadMembers() {
        const response = await fetch("data/members.json");
        const members = await response.json();

        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${member.image}" alt="${member.name}">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank">Visit Website</a>
            `;

            directory.appendChild(card);
        });
    }

    // Toggle Grid/List View
    gridViewBtn.addEventListener("click", () => {
        directory.classList.remove("list");
    });

    listViewBtn.addEventListener("click", () => {
        directory.classList.add("list");
    });

    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();
    
    // Set last modified date
    document.getElementById("lastModified").textContent = document.lastModified;

    loadMembers();
});
