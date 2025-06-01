import { StoryCard } from './StoryCardComponent.js';
import { StoryStateMgr } from './StoryStateMgr.js'
import { getUrlParamsMap } from "./url.js";
import { sanitizeName } from "./sanitizeName.js";
import { stories } from './stories.js';


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createReadButton() {
  const button = document.createElement('button');
  button.textContent = 'Read';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.padding = '15px 30px';
  button.style.fontSize = '18px';
  button.style.borderRadius = '8px';
  button.style.backgroundColor = '#007bff';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.zIndex = '1000';
  return button;
}

function main() {
  const paramsMap = getUrlParamsMap();
  const nameReplacements = [];
  let readPhrase = true;
  let readSentence = false;
  let shuffleStories = false;
  let startIndex = 0;
  paramsMap.forEach((value, key) => {
    const possName = sanitizeName(value);
    if (!possName || !key) {
      return;
    }
    if (key === 'read_sentence') {
      readSentence = true;
      readPhrase = false;
    }
    if (key === 'shuffle_stories') {
      shuffleStories = true;
    }
    if (key === 'start_index') {
      const possibleInt = parseInt(value);
      if (!isNaN(possibleInt)) {
        startIndex = possibleInt;
      }
    }
    nameReplacements.push({
      'old': key,
      'new': possName,
    });
    if (key[0].toLowerCase() === key[0] && possName[0].toLowerCase() === possName[0]) {
      nameReplacements.push({
      'old': capitalizeFirstLetter(key),
      'new': capitalizeFirstLetter(possName),
    });
    }
  });
  const storyCard = new StoryCard();
  document.body.appendChild(storyCard);
  const storyStateMgr = new StoryStateMgr(storyCard);

  // Add read button
  const readButton = createReadButton();
  document.body.appendChild(readButton);
  readButton.onclick = () => storyStateMgr.readWordAndMoveToNextWord();

  let storiesClone = [...stories];
  if (startIndex) {
    storiesClone = stories.slice(startIndex).concat(stories.slice(0, startIndex));
  }
  if (shuffleStories) {
    shuffleArray(storiesClone);
  }
  storyStateMgr.loadStories(storiesClone, readPhrase, readSentence, nameReplacements);

  setupKeyboardControl(storyStateMgr);
}

function setupKeyboardControl(storyStateMgr) {
  document.body.onkeyup = evt => {
    if (evt.key == " ") {
      storyStateMgr.readWordAndMoveToNextWord();
    } else if (evt.key == "ArrowLeft") {
      storyStateMgr.moveToPreviousWord();
    } else if (evt.key == "n") {
      storyStateMgr.moveToNextStory();
    } else if (evt.key == "p") {
      storyStateMgr.moveToPreviousStory();
    }
  };
  
  // Add touch support
  document.body.addEventListener('touchstart', (evt) => {
    evt.preventDefault(); // Prevent double-firing on some devices
    storyStateMgr.readWordAndMoveToNextWord();
  });
  // Add touch support
  document.body.addEventListener('click', (evt) => {
    evt.preventDefault(); // Prevent double-firing on some devices
    storyStateMgr.readWordAndMoveToNextWord();
  });
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

main();


