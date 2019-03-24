const form = document.querySelector('.onboarding-form');
const originalPngInput = form.querySelector('[name="original"');
const actualUrlInput = form.querySelector('[name="actualUrl"');
const submitButton = form.querySelector('button');

const results = document.querySelector('.results');
const success = document.querySelector('.success');
const successValue = document.querySelector('.success__value');
const tabsItems = document.querySelectorAll('.tabs__item');
const resultsImageItems = document.querySelectorAll('.results__image-item');
const resultsImages = document.querySelectorAll('.results__image');

const isFirstSubmitDone = false;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let removeProcessingMessage;

  submitButton.classList.add('is-loading');
  submitButton.setAttribute('disabled', 'disabled');

  if (!isFirstSubmitDone) {
    removeProcessingMessage = addProcessingMessage();
  }

  const formData = new FormData();

  const originalPng = originalPngInput.files[0];

  formData.append('original', originalPng, originalPng.name);
  formData.append(actualUrlInput.name, actualUrlInput.value);

  const responseData = await fetch('api/process', {
    body: formData,
    method: 'post'
  }).then((response) => response.json());

  if (removeProcessingMessage) {
    removeProcessingMessage();
  }

  updateResults(responseData);
});

const updateResults = ({actualImage, originalImage, amountInvalidPixels, diffImage}) => {
  submitButton.removeAttribute('disabled');

  successValue.innerText = Number(100 - amountInvalidPixels).toFixed() + '%';
  success.style.setProperty('--missing-score-percent', Number(amountInvalidPixels) + '%');

  const images = [diffImage, actualImage, originalImage];

  images.forEach((image, index) => {
    resultsImages[index].src = image;
  });

  submitButton.classList.remove('is-loading');
  submitButton.removeAttribute('disabled');

  results.classList.add('results_visible');
};

const updateTabs = (index) => {
  tabsItems.forEach((tabsItem, currentIndex) => {
    const method = currentIndex === index ? 'add' : 'remove';

    tabsItem.classList[method]('is-active');
    resultsImageItems[currentIndex].classList[method]('is-active');
  });
};

[...tabsItems].forEach((resultsImage, index) => {
  resultsImage.addEventListener('click', () => {
    updateTabs(index);
  });
});

const addProcessingMessage = () => {
  const startTime = new Date();
  const container = document.querySelector('.container');
  const message = document.createElement('div');
  const messageBody = document.createElement('div');
  let processFinished = false;

  message.classList.add('message');
  messageBody.classList.add('message-body');

  message.appendChild(messageBody);
  container.appendChild(message);

  const step = () => {
    if (!processFinished) {
      const pastSeconds = Math.floor((new Date() - startTime) / 1000);

      messageBody.innerHTML = `Processing images can take up to 30 sec.</br> Past time: ${pastSeconds}s`;
      setTimeout(step, 1000);
    }
  };

  step();

  return () => {
    processFinished = true;
    container.removeChild(message);
  };
};
