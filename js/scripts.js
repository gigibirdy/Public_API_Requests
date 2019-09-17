//create search bar
const searchContainer = document.getElementsByClassName('search-container')[0];
const form = document.createElement('form');
form.setAttribute('action', '#');
form.setAttribute('method', 'get');
const inputSearch = document.createElement('input');
inputSearch.setAttribute('type', 'search');
inputSearch.setAttribute('id', 'search-input');
inputSearch.setAttribute('class', 'search-input');
inputSearch.setAttribute('placeholder', 'Search...');
const inputSubmit = document.createElement('input');
inputSubmit.setAttribute('type', 'submit');
// inputSubmit.setAttribute('value', '&#x1F50D');
inputSubmit.setAttribute('id', 'serach-submit');
inputSubmit.setAttribute('class', 'search-submit');
//add search bar to the DOM
searchContainer.appendChild(form);
form.appendChild(inputSearch);
form.appendChild(inputSubmit);

/*add a loading page to improve user experience as the fetched data does not all
come in once, notice the time gap between first and last employee records is about
1s. */
const header = document.getElementsByTagName('HEADER')[0];
const headerContainer = document.getElementsByClassName('header-inner-container')[0];
const overlay = document.createElement('div');
const img = document.createElement('img');
const h1 = document.createElement('h1');
h1.setAttribute('class', 'greeting');
h1.textContent = 'Hello. Please wait...'
img.setAttribute('src', 'images/loading.gif');
img.setAttribute('class', 'loading');
overlay.appendChild(h1);
overlay.appendChild(img);
overlay.setAttribute('class', 'overlay');
overlay.style.visibility = 'visible';
header.insertBefore(overlay, headerContainer);

//reusable fetch function
const greeting = document.getElementsByClassName('greeting')[0];

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => {
      console.log('error', error)
      greeting.textContent = 'Oops! There is an network error. Please try it again later.';
    })
};


function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(reponse.statusText));
  }
};

//return data in all languages
function fetchDataWithoutFilter() {
  fetchData('https://randomuser.me/api/?results=12')
    .then(data => {
      data.results.map(result => {
        directory(result);
        modal(result);
      })
    })
};

/*return data in the English alphabet only by filtering employees' nationality*/
fetchData('https://randomuser.me/api/?results=12&nat=us,au,nz,gb,ie,nz')
  .then(data => {
    data.results.map(result => {
      directory(result);
      if (gallery.children.length === 12) {
        overlay.style.visibility = 'hidden';
      }
      modal(result);
    })
  });

//create and append cards to gallery element
const gallery = document.getElementById('gallery');

function directory(result) {
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  card.style.display = 'inline-flex';
  gallery.appendChild(card);
  let html = `
  <div class="card-img-container">
      <img class="card-img" src=${result.picture.thumbnail} alt="profile picture">
  </div>
  <div class="card-info-container">
      <h3 id="name" class="card-name cap">${result.name.first} ${result.name.last}</h3>
      <p class="card-text">${result.email}</p>
      <p class="card-text cap">${result.location.city}, ${result.location.state}</p>
  </div>
  `;
  card.innerHTML = html;
};

//create container for modal elements
const modalContainer = document.createElement('div');
modalContainer.setAttribute('class', 'modal-container');
modalContainer.style.visibility = 'hidden';
document.body.appendChild(modalContainer);

//create and append modal elements to modal container
function modal(result) {
  const modal = document.createElement('div');
  modal.setAttribute('class', 'modal');
  modal.style.display = 'none';
  modalContainer.appendChild(modal);
  const html = `
      <button type="button" class="modal-copy-btn"><i class="far fa-copy"></i></button>
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="modal-img" src=${result.picture.thumbnail} alt="profile picture">
          <h3 id="name" class="modal-name cap">${result.name.first} ${result.name.last}</h3>
          <p class="modal-text">${result.email}</p>
          <p class="modal-text cap">${result.location.city}</p>
          <hr>
          <p class="modal-text">${result.cell}</p>
          <p class="modal-text">${result.location.street}, ${result.location.city}, ${result.location.state} ${result.location.postcode}</p>
          <p class="modal-text">${result.dob.date.slice(0, 10)}</p>
      </div>
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn" style="display: ${modalContainer.children.length === 1 ? 'none' : 'block'}">PREV</button>
          <button type="button" id="modal-next" class="modal-next btn" style="display: ${modalContainer.children.length === 12 ? 'none' : 'block'}">NEXT</i></button>
      </div>
  `;
  modal.innerHTML = html;
};

//event listener

//click anywhere of a card to open up modal window
const modalElement = document.getElementsByClassName('modal');
const cardImg = document.getElementsByClassName('card-img');
const modalImg = document.getElementsByClassName('modal-img');
gallery.addEventListener('click', function(e) {
  for (let i = 0; i < gallery.children.length; i++) {
    if (e.target.parentNode === gallery.children[i] || e.target.parentNode.parentNode === gallery.children[i]) {
      if (cardImg[i].src === modalImg[i].src) {
        modalContainer.style.visibility = 'visible';
        modalElement[i].style.display = 'block';
      }
    }
  }
});

//click the modal close button to close modal window
modalContainer.addEventListener('click', function(e) {
  const modalBtn = document.getElementsByClassName('modal-close-btn');
  for (let i = 0; i < modalContainer.children.length; i++) {
    if (e.target === modalBtn[i].firstElementChild) {
      modalElement[i].style.display = 'none';
      modalContainer.style.visibility = 'hidden';
    }
  }
});

//search by employees' names
const names = document.getElementsByClassName('card-name');

function filterByName(input) {
  for (let i = 0; i < names.length; i++) {
    let name = names[i].textContent.toLowerCase();
    for (let j = 0; j < name.length; j++) {
      if (input.toLowerCase() === name.slice(j, j + input.length)) {
        gallery.children[i].style.display = "inline-flex";
        break;
      } else {
        gallery.children[i].style.display = "none";
      }
    }
  }
};

/*when user starts entering, if there is any match, show search results.
Hide prev button of first visible modal and next button of last visible modal
when user is in search model*/
inputSearch.addEventListener('keyup', function(e) {
  filterByName(e.target.value);
  hidePrevNextModalBtn(e.target.value);
});

/*when user clicks on the submit button, if there is any match, show search results.
Hide prev button of first visible modal and next button of last visible modal
when user is in search model*/
const searchBtn = document.getElementById('serach-submit');
searchBtn.addEventListener('click', function(e) {
  e.preventDefault();
  const input = document.getElementById('search-input');
  filterByName(input.value);
  hidePrevNextModalBtn(input.value);
});


const prev = document.getElementsByClassName('modal-prev');
const next = document.getElementsByClassName('modal-next');

/*Hide prev button of first visible modal and next button of last visible modal
when user is in search model*/
function hidePrevNextModalBtn(input) {
  for (let i = 1; i < gallery.children.length - 1; i++) {
    next[i].style.display = 'block';
    prev[i].style.display = 'block';
  }
  for (let i = 0; i < gallery.children.length; i++) {
    if (gallery.children[i].style.display !== 'none') {
      prev[i].style.display = 'none';
      break;
    }
  }
  for (let i = gallery.children.length - 1; i >= 0; i--) {
    if (gallery.children[i].style.display !== 'none') {
      next[i].style.display = 'none';
      break;
    }
  }
};

/*click buttons to review previous and next employee. This function works for both
view model and search model.*/
modalContainer.addEventListener('click', function(e) {
  for (let i = 0; i < modalContainer.children.length; i++) {
    if (e.target === prev[i]) {
      modalElement[i].style.display = 'none';
      for (let j = 1; j < i + 1; j++) {
        if (gallery.children[i - j].style.display !== 'none') {
          modalElement[i - j].style.display = 'block';
          break;
        } else {
          continue;
        }
      }
    } else if (e.target === next[i]) {
      modalElement[i].style.display = 'none';
      for (let j = 1; j < gallery.children.length - i; j++) {
        if (gallery.children[i + j].style.display !== 'none') {
          modalElement[i + j].style.display = 'block';
          break;
        } else {
          continue;
        }
      }
    }
  }
});

/*add a copy button for each modal, by clicking this button, user will be able
to copy the employee record to their clipboard.*/
modalContainer.addEventListener('click', function(e) {
  for (let i = 0; i < modalContainer.children.length; i++) {
    const copyBtn = document.getElementsByClassName('modal-copy-btn');
    if (e.target === copyBtn[i].firstElementChild) {
      const copyText = document.getElementsByClassName('modal-info-container');
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(copyText[i]);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      selection.removeAllRanges();
      const original = copyBtn[i].innerHTML;
      copyBtn[i].innerHTML = '<span>Copied!</span>';
      setTimeout(() => {
        copyBtn[i].innerHTML = original;
      }, 1000);
    }
  }
});

//CSS style
const style = document.createElement('style');
document.head.appendChild(style);
style.innerHTML = `
.overlay {
  display: flex;
  flex-direction: column;
  position: fixed;
  background: rgba(255, 255, 255, 1);
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 5px;
  transition: 1.2s ease-out;
}

body{
  background-image: url(https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9);
  background-size: cover;
  background-position: center;
}
.modal-btn-container {
  border: none;
}
header h1 {
  color: rgba(255, 255, 255, 1);
}
.modal-copy-btn{
      position: absolute;
      top: 15px;
      left: 15px;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.9);
      background: rgba(0, 0, 0, 0.8);
      outline: none;
      border-radius: 0.25em;
      border: 1px solid rgba(50, 50, 50, 0.3);
}
.greeting{
  color: darkgrey;
}
.card {
  box-shadow: -8px 10px 16px -4px rgba(0,0,0,0.75);
}
`;
