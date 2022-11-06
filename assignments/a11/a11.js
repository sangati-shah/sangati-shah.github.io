document.querySelector('button').addEventListener("click", getInsult);

const insult_url = 'https://insult.mattbas.org/api/insult'
const cat_url = 'https://api.thecatapi.com/v1/images/search'

async function getInsult() {
    fetch(insult_url)
    .then(function(response) {
        return response.text();
    }).then(function(data) {
        console.log(data); // this will be a string
        displayInsult(data);
        
    });

    fetch(cat_url)
    .then(response => {
        return response.json();
    })
    .then(json => {
        displayCat(json[0].url);
    })

    .catch(err => console.log(err));
}

function displayInsult(qoute){
    const qouteText = document.querySelector('#js-quote-text');
    qouteText.textContent = qoute;
}

function displayCat(url){
    var div = document.querySelector('#cat-gif');
    div.removeChild(div.firstChild);
    var img = document.createElement("img");
    img.src = url;
    div.appendChild(img);
}
