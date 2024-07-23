document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById("dog-bar");
  const dogInfo = document.getElementById("dog-info");
  const filterButton = document.getElementById("good-dog-filter");
  let allPups = [];

  fetch("http://localhost:3000/pups")
    .then((response) => response.json())
    .then((data) => {
      allPups = data;
      displayPups(data);
    });

  function displayPups(pups) {
    dogBar.innerHTML = "";
    pups.forEach((pup) => {
      const span = document.createElement("span");
      span.textContent = pup.name;
      span.addEventListener("click", () => showPupInfo(pup));
      dogBar.appendChild(span);
    });
  }

  function showPupInfo(pup) {
    dogInfo.innerHTML = `
        <img src="${pup.image}" alt="${pup.name}">
        <h2>${pup.name}</h2>
        <button>${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
      `;
    const button = dogInfo.querySelector("button");
    button.addEventListener("click", () => toggleGoodDog(pup, button));
  }

  function toggleGoodDog(pup, button) {
    const newStatus = !pup.isGoodDog;
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isGoodDog: newStatus }),
    })
      .then((response) => response.json())
      .then((updatedPup) => {
        pup.isGoodDog = updatedPup.isGoodDog;
        button.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!";
        if (filterButton.textContent === "Filter good dogs: ON") {
          displayPups(allPups.filter((pup) => pup.isGoodDog));
        }
      });
  }

  filterButton.addEventListener("click", () => {
    if (filterButton.textContent === "Filter good dogs: OFF") {
      filterButton.textContent = "Filter good dogs: ON";
      displayPups(allPups.filter((pup) => pup.isGoodDog));
    } else {
      filterButton.textContent = "Filter good dogs: OFF";
      displayPups(allPups);
    }
  });
});
