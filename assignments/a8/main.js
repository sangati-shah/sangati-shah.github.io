// 1. COMPLETE VARIABLE AND FUNCTION DEFINITIONS
const customName = document.getElementById('customname');
const randomize = document.getElementById('randomize');
const story = document.getElementById('story');

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}

// 2. RAW TEXT STRINGS
const storyText = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";
const insertX = ["Willy the Goblin", "Big Daddy", "Father Christmas"];
const insertY = ["the soup kitchen", "Disneyland", "the White House"];
const insertZ = ["spontaneously combusted", "melted into a puddle on the sidewalk", "turned into a slug and crawled away"];

// 3. EVENT LISTENER AND PARTIAL FUNCTION DEFINITION
randomize.addEventListener('click', result);
let newStory = storyText;

function result() {
    if(customName.value !== '') {
        const name = customName.value;
        newStory = newStory.replace("Bob", name);
    }

    if(document.getElementById("uk").checked) {
        const weight = Math.round(21.42) + " stone";
        const temperature =  Math.round(34.44) + " centigrade";

        newStory = newStory.replace("300 pounds", weight);
        newStory = newStory.replace("94 fahrenheit", temperature);
    }
    let xItem = randomValueFromArray(insertX);
    let yItem = randomValueFromArray(insertY);
    let zItem = randomValueFromArray(insertZ);

    newStory = newStory.replace(":insertx:", xItem);
    newStory = newStory.replace(":inserty:", yItem);
    newStory = newStory.replace(":insertz:", zItem);

    story.textContent = newStory;
    story.style.visibility = 'visible';
 
}


