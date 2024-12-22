const searchInput = document.querySelector<HTMLInputElement>('.input');
const buttonElement = document.querySelector<HTMLButtonElement>('.button');
const cardElement = document.querySelector<HTMLDivElement>('.cards');
const useInputElement = document.querySelector<HTMLInputElement>("input[value='users']");

if (!searchInput || !buttonElement || !cardElement || !useInputElement) {
    throw new Error("One or more DOM elements are missing!");
}

interface GitHubUser {
    avatar_url: string;
    login: string;
}

interface GitHubApiResponse {
    items: GitHubUser[];
}

const setSearchResult = (data: any): void => {
    if (data.items.length === 0) {
        cardElement.innerHTML = "<h2>No results found.</h2>";
        cardElement.classList.add('noResult');
        return;
    }

    let result = "";
    data.items.forEach((item: any) => {
        result += `
        <article class='card'>
            <a href="${item.html_url}" target="_blank" rel="noopener noreferrer">
                <img class="img" loading="lazy" src="${item.avatar_url}" alt="${item.login}"/>
            </a>
            <h2 class="name">${item.login}</h2>
        </article>
        `;
    });
    cardElement.innerHTML = result;
};


const performSearch = (searchTerm: string, choice: boolean): void => {
    if (!searchTerm.trim()) {
        cardElement.innerHTML = "<p>Please enter a search term.</p>";
        return;
    }

    const queryType = choice ? "+type:user" : "+type:org";
    const USER_API = "https://api.github.com/search/users?q=";

    fetch(`${USER_API}${encodeURIComponent(searchTerm)}${queryType}`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok!");
            return response.json();
        })
        .then((result: GitHubApiResponse) => setSearchResult(result))
        .catch(error => {
            cardElement.innerHTML = `<p>Error: ${error.message}</p>`;
        });
};

buttonElement.addEventListener("click", (event: Event) => {
    event.preventDefault();
    performSearch(searchInput.value, useInputElement.checked);
});
