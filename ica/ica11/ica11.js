document.querySelector('button').addEventListener("click", getQoute);

const url = 'https://api.whatdoestrumpthink.com/api/v1/quotes/random'

async function getQoute() {
    const response = await fetch(url);
    try{
        if(!response.ok){
            throw Error(response.statusText)
        }

        const json = await response.json();
        console.log(json.message)
        displayQuote(json.message)

    } catch (err){
        console.log(err);
        alert("Error")
    }
}

function displayQuote(qoute){
    const qouteText = document.querySelector('#js-quote-text');
    qouteText.textContent = qoute;
}

