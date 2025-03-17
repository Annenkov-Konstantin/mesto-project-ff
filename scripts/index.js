// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardElement = cardTemplate.querySelector('.places__item');
const placesList = document.querySelector('.places__list');

function createCard(item, deleteCardFunction) {
  let clonedElement = cardElement.cloneNode(true);
  clonedElement.querySelector('.card__image').src = item.link;
  clonedElement.querySelector('.card__image').alt = item.name;
  clonedElement.querySelector('.card__title').textContent = item.name;
  clonedElement
    .querySelector('.card__delete-button')
    .addEventListener('click', deleteCardFunction);
  return clonedElement;
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
  const deleteButton = evt.target;
  const card = deleteButton.closest('.card');
  card.remove();
}

// @todo: Вывести карточки на страницу

function pasteCards(array) {
  array.forEach((item) => {
    let readyElement = createCard(item, deleteCard);
    placesList.append(readyElement);
  });
}

pasteCards(initialCards);
