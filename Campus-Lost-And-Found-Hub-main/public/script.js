let allItems = [];
const form = document.getElementById("itemForm");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const item = {
        type: document.getElementById("itemType").value,
        name: document.getElementById("itemName").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        date: document.getElementById("date").value,
        contact: document.getElementById("contact").value
    };

    try {

        const response = await fetch("/api/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });

        if (response.ok) {

            alert("Item reported successfully! ❤️");

            form.reset();

            loadItems();

        } else {

            alert("Something went wrong.");

        }

    } catch (error) {

        console.error(error);

        alert("Could not connect to the server.");

    }

});


async function loadItems() {

    try {

        const response = await fetch("/api/items");

        const items = await response.json();

        allItems = items;

        displayItems(items);

    } catch (error) {

        console.error("Error loading items:", error);

    }
}


function displayItems(items) {

    const container = document.getElementById("itemsContainer");

    if (items.length === 0) {

        container.innerHTML = "<p>No items found.</p>";

        return;
    }

    container.innerHTML = "";

    items.forEach(function (item) {

        const card = document.createElement("div");

        card.className = "item-card";

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Date:</strong> ${item.date}</p>
            <p><strong>Contact:</strong> ${item.contact}</p>
            <p><strong>Status:</strong> ${item.status || "Active"}</p>

            ${
                item.status === "Returned"
                ? "<p>✅ This item has been returned.</p>"
                : `<button onclick="markReturned(${item.id})">
                    Mark as Returned
                </button>`
            }
        `;

        container.appendChild(card);

    });
}


async function markReturned(id) {

    try {

        const response = await fetch(`/api/items/${id}/return`, {
            method: "PUT"
        });

        if (response.ok) {

            alert("Item marked as returned! ❤️");

            loadItems();

        } else {

            alert("Could not update the item.");

        }

    } catch (error) {

        console.error(error);

        alert("Could not connect to the server.");

    }
}


loadItems();
function filterItems() {

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const filterType =
        document.getElementById("filterType").value;

    const filteredItems = allItems.filter(function (item) {

        const matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText);

        const status = item.status || "Active";

        const matchesType =
            filterType === "All" ||
            item.type === filterType ||
            status === filterType;

        return matchesSearch && matchesType;

    });

    displayItems(filteredItems);
}
document.getElementById("searchInput").addEventListener(
    "input",
    filterItems
);

document.getElementById("filterType").addEventListener(
    "change",
    filterItems
);