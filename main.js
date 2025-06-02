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
  button.style.width = '50%';
  button.style.height = '240px';  // 120px * 4
  button.style.position = 'static';
  button.style.margin = '20px 0';
  button.style.padding = '80px';  // 20px * 4
  button.style.fontSize = '96px';  // 24px * 4
  button.style.borderRadius = '32px';  // 8px * 4
  button.style.backgroundColor = '#007bff';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  return button;
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

  // Add read button only for mobile
  if (isMobileDevice()) {
    const readButton = createReadButton();
    document.body.appendChild(readButton);
    readButton.onclick = () => storyStateMgr.readWordAndMoveToNextWord();
  }

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
  
  // Add touch support only for mobile
  if (isMobileDevice()) {
    document.body.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      storyStateMgr.readWordAndMoveToNextWord();
    });
    document.body.addEventListener('click', (evt) => {
      evt.preventDefault();
      storyStateMgr.readWordAndMoveToNextWord();
    });
  }
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


