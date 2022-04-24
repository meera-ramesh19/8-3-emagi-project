// Make API Requests to the following endpoint: https://emagi-server-8-3.herokuapp.com/api/emojis
let encodeEmojiStr = [];
let code = '';
let space = false;
const checkforEncodeString = (data, encodeInputStr) => {
  const encodeInput = document.querySelector('#encode form');
  console.log(data);

  console.log(space, encodeInputStr);

  encodeInputStr = encodeInputStr.split('');

  console.log(encodeInputStr);
  const encodeEmojiStr = encodeInputStr
    .map((char) => {
      if (
        typeof char === 'string' &&
        char.length === 1 &&
        !/[A-Za-z]/.test(char)
      )
        return char;

      return data.find((emoji) => emoji.letter === char.toLowerCase()).symbol;
    })
    .join('');

  console.log(encodeEmojiStr);

  document.querySelector('#encode aside.result p').textContent = encodeEmojiStr;

  if (encodeEmojiStr.length === 0) {
    document.querySelector('#encode aside').classList.remove('success');
    document.querySelector('#encode aside').classList.add('error');
  } else {
    document.querySelector('#encode aside').classList.remove('error');
    document.querySelector('#encode aside').classList.add('success');
  }

  encodeInput.reset();
};

const checkforReplaceText = (results, sentence) => {
  sentenceArr = sentence.split(/\s/);
  // for whitespace ,tabs and return
  // sentence = sentence.split(/(\s)/);
  // sentence = sentence.split(/(\s+)/);
  // without regex
  // sentence =sentence.split(' ').join('# #').split('#');

  for (let i = 0; i < sentenceArr.length; i++) {
    let word = sentenceArr[i].toLowerCase();
    for (let j = 0; j < results.length; j++) {
      console.log('name= ', results[j].name);
      if (word.includes(results[j].name)) {
        sentenceArr[i] = sentenceArr[i].replace(
          results[j].name,
          results[j].symbol
        );
      }
    }
  }

  document.querySelector('#replace aside.result p').textContent =
    sentenceArr.join(' ');

  if (sentence.length === 0) {
    document
      .querySelector('#replace aside.result ')
      .classList.remove('success');
    document.querySelector('#replace aside.result ').classList.add('error');
  } else {
    document.querySelector('#replace aside.result').classList.remove('error');
    document.querySelector('#replace aside.result ').classList.add('success');
  }

  replaceInput.reset();
};

const checkforTextToSearch = (emojis, sentence) => {
  console.log(emojis);
  let text = '';
  let searchArr = sentence.split(' ');

  for (let i = 0; i < searchArr.length; i++) {
    for (let j = 0; j < emojis.length; j++) {
      if (emojis[j].name.includes(searchArr[i])) {
        if ((searchArr[i].length = emojis[i].name.length)) {
          text += emojis[j].symbol;
        }
      }
    }
    if (text.length > 0) {
      searchArr[i] = searchArr[i].replace(searchArr[i], text);
    }
  }

  document.querySelector('#search aside.result p').textContent =
    searchArr.join(' ');

  if (sentence.length === 0) {
    document.querySelector('#search aside.result ').classList.remove('success');
    document.querySelector('#search aside.result ').classList.add('error');
  } else {
    document.querySelector('#search aside.result').classList.remove('error');
    document.querySelector('#search aside.result ').classList.add('success');
  }

  searchInput.reset();
};

const generateCategories = (results) => {
  console.log(results);
  let categories = new Set();
  for (let result of results) {
    for (let cat of result.categories) {
      categories.add(cat);
    }
  }
  return [...categories];
};
const checkforRandom = (results, inputStr) => {
  let select = document.getElementById('category');

  let categories = generateCategories(results);

  categories.forEach((category) => {
    let option = document.createElement('option');
    option.value = category.charAt(0).toUpperCase() + category.slice(1);
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    select.append(option);
  });

  select.addEventListener('change', (e) => {
    const searchVal = e.target.value;

    if (searchVal === 'none') {
      message = 'Error !! Field cannot be empty.Please enter some text';
      renderErrorMessage(message, 'random');
      return;
    }
    const emojiArr = [];
    for (let result of results) {
      for (let cat of result.categories) {
        if (cat === searchVal.toLowerCase()) {
          emojiArr.push(result.symbol);
        }
      }
    }

    const random = Math.floor(Math.random() * emojiArr.length);

    document.querySelector('#random aside.result p').textContent =
      emojiArr[random];

    if (select.length === 0) {
      document
        .querySelector('#random aside.result ')
        .classList.remove('success');
      document.querySelector('#random aside.result ').classList.add('error');
    } else {
      document.querySelector('#random aside.result').classList.remove('error');
      document.querySelector('#random aside.result ').classList.add('success');
    }

    randomInput.reset();
  });
};

const renderErrorMessage = (err, code) => {
  const aside = document.querySelector('aside');
  const h5 = document.createElement('h5');
  const display = document.querySelector(`#${code} aside.result h3+p`);
  display.append(h5);
  aside.setAttribute('class', 'error');
  h5.textContent = `${err}`;
  setTimeout(() => {
    h5.style.display = 'none';
    aside.removeAttribute('class', 'error');
  }, 5000);
  h5.style.display = 'block';
};

const checkAllFeature = (data, inputStr, code) => {
  console.log('i am in checkallfeature');
  if (code === 'encode') {
    checkforEncodeString(data, inputStr);
  } else if (code === 'replace') {
    checkforReplaceText(data, inputStr);
  } else if (code === 'search') {
    checkforTextToSearch(data, inputStr);
  } else if (code === 'random') {
    checkforRandom(data, inputStr);
  }
};

const fetchApiData = async (url, inputStr, code) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    // console.log(data);
    checkAllFeature(data, inputStr, code);
  } catch (error) {
    renderErrorMessage(error, code);
  }
};

let encodeInput,
  replaceInput,
  searchInput,
  randomInput,
  emojisArray = [];

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  console.log(event.target);

  //** ENCODE PHRASE FORM ****/

  encodeInput = document.querySelector('#encode form');
  encodeInput.addEventListener('submit', (e) => {
    e.preventDefault();

    let encodeInputStr = e.target.encode.value;
    console.log(encodeInputStr);

    if (!encodeInputStr) {
      message = 'Error !! Input field cannot be empty.Please enter some text';
      renderErrorMessage(message, 'encode');
      return;
    }

    const url = 'https://emagi-server-8-3.herokuapp.com/api/emojis';
    console.log('entering the fetch');
    fetchApiData(url, encodeInputStr, 'encode');
  });

  // //** REPLACE TEXT FORM ****/

  replaceInput = document.querySelector('#replace form');

  replaceInput.addEventListener('submit', (event) => {
    event.preventDefault();

    let replaceInputStr = event.target.replace.value;
    console.log(replaceInputStr);

    if (!replaceInputStr) {
      message = 'Error !! Field cannot be empty.Please enter some text';
      renderErrorMessage(message, 'replace');
      return;
    }

    const url = 'https://emagi-server-8-3.herokuapp.com/api/emojis';
    console.log('entering the fetch');
    fetchApiData(url, replaceInputStr, 'replace');
  });

  // //** search TEXT FORM ****/

  searchInput = document.querySelector('#search form');

  searchInput.addEventListener('submit', (event) => {
    event.preventDefault();

    let searchInputStr = event.target.search.value;
    console.log(searchInputStr);

    if (!searchInputStr) {
      message = 'Error !! Field cannot be empty.Please enter some text';
      renderErrorMessage(message, 'search');
      return;
    }

    const url = 'https://emagi-server-8-3.herokuapp.com/api/emojis';
    console.log('entering the fetch');
    fetchApiData(url, searchInputStr, 'search');
  });

  // //** randomctegory TEXT FORM ****/

  randomInput = document.querySelector('#random form');
  const select = document.querySelector('#category');

  randomInput.addEventListener('submit', (event) => {
    event.preventDefault();

    let randomInputStr = event.target.category.value;
    console.log(randomInputStr);

    const url = 'https://emagi-server-8-3.herokuapp.com/api/emojis';
    console.log('entering the fetch');
    fetchApiData(url, randomInputStr, 'random');
  });
});
