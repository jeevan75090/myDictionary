const searchContainer = document.querySelector(".search-container");
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const cardsContainer = document.querySelector(".cards-container");
const historyBtn = document.querySelector("#historyBtn");
const historyPage = document.querySelector(".history-page");
const historyContainer = document.querySelector("#historyContainer");
const backBtn = document.querySelector("#backBtn");
const deleteBtn = document.querySelector("#deleteBtn");

// Event listener for search button
searchBtn.addEventListener("click", display);

// Event listener for history button
historyBtn.addEventListener("click", displayHistory);

// Event listener for back button on history page
backBtn.addEventListener("click", () => {
  historyPage.style.display = "none";
  searchContainer.style.display = "flex";
});

// Event listener for delete button on history page
deleteBtn.addEventListener("click", deleteHistory);

// Display word card with meaning
function display() {
  const searchText = searchInput.value;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchText}`)
    .then((res) => res.json())
    .then((output) => {
      const definition = output[0]?.meanings[0]?.definitions[0]?.definition;

      if (definition) {
        const textData = {
          word: searchText,
          meaning: definition,
        };

        let existingData = JSON.parse(localStorage.getItem("searches")) || [];
        existingData.push(textData);
        localStorage.setItem("searches", JSON.stringify(existingData));

        createCard(searchText, definition);
        searchInput.value = "";
      } else {
        alert("No results found for the entered word.");
      }
    })
    .catch((error) => {
      console.log("An error occurred:", error);
    });
}

// Event listener for Enter key press in the search input field
searchInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault(); // Prevent form submission
    searchBtn.click(); // Trigger search button click
  }
});



// Display search history
function displayHistory() {
  searchContainer.style.display = "none";
  historyPage.style.display = "block";
  historyContainer.innerHTML = "";

  // const searchHistory = JSON.parse(localStorage.getItem("searches"));

  if (searchHistory && searchHistory.length > 0) {
    for (const item of searchHistory) {
      createCard(item.word, item.meaning);
    }
  } else {
    historyContainer.innerHTML =
      '<p id="no-search-found" >No search history found.</p>';
  }
}

// Create a word card and append it to the cards container
function createCard(word, meaning) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h3>${word}</h3>
    <p>${meaning}</p>
    <button class="deleteBtn">Delete</button>
  `;

  const deleteButton = card.querySelector(".deleteBtn");
  deleteButton.addEventListener("click", () => {
    deleteCard(card, word);
  });

  cardsContainer.appendChild(card);
}

// Delete a word card and remove it from local storage
function deleteCard(card, word) {
  card.remove();

  const searchHistory = JSON.parse(localStorage.getItem("searches"));

  if (searchHistory) {
    const updatedHistory = searchHistory.filter((item) => item.word !== word);
    localStorage.setItem("searches", JSON.stringify(updatedHistory));
  }
}

// Delete all word cards and clear local storage
function deleteHistory() {
  cardsContainer.innerHTML = "";
  localStorage.removeItem("searches");
}
