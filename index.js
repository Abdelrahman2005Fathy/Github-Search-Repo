var searchInput = document.querySelector('.input');
var buttonElement = document.querySelector('.button');
var cardElement = document.querySelector('.cards');
var useInputElement = document.querySelector("input[value='users']");
if (!searchInput || !buttonElement || !cardElement || !useInputElement) {
    throw new Error("One or more DOM elements are missing!");
}
var setSearchResult = function (data) {
    if (data.items.length === 0) {
        cardElement.innerHTML = "<h2>No results found.</h2>";
        cardElement.classList.add('noResult');
        return;
    }
    var result = "";
    data.items.forEach(function (item) {
        result += "\n        <article class='card'>\n            <a href=\"".concat(item.html_url, "\" target=\"_blank\" rel=\"noopener noreferrer\">\n                <img class=\"img\" loading=\"lazy\" src=\"").concat(item.avatar_url, "\" alt=\"").concat(item.login, "\"/>\n            </a>\n            <h2 class=\"name\">").concat(item.login, "</h2>\n        </article>\n        ");
    });
    cardElement.innerHTML = result;
};
var performSearch = function (searchTerm, choice) {
    if (!searchTerm.trim()) {
        cardElement.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }
    var queryType = choice ? "+type:user" : "+type:org";
    var USER_API = "https://api.github.com/search/users?q=";
    fetch("".concat(USER_API).concat(encodeURIComponent(searchTerm)).concat(queryType))
        .then(function (response) {
        if (!response.ok)
            throw new Error("Network response was not ok!");
        return response.json();
    })
        .then(function (result) { return setSearchResult(result); })
        .catch(function (error) {
        cardElement.innerHTML = "<p>Error: ".concat(error.message, "</p>");
    });
};
// إضافة حدث عند النقر على الزر
buttonElement.addEventListener("click", function (event) {
    event.preventDefault();
    performSearch(searchInput.value, useInputElement.checked);
});
