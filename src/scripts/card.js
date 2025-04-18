export function createCard(
  item,
  cardElement,
  deleteCardFunction,
  showImageFunction,
  likeFunction
) {
  const clonedElement = cardElement.cloneNode(true);
  const cardImage = clonedElement.querySelector('.card__image');
  cardImage.src = item.link;
  cardImage.alt = item.name;
  cardImage.addEventListener('click', function () {
    showImageFunction(item.link, item.name);
  });
  const likeButton = clonedElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', likeFunction);
  clonedElement.querySelector('.card__title').textContent = item.name;
  clonedElement
    .querySelector('.card__delete-button')
    .addEventListener('click', deleteCardFunction);
  return clonedElement;
}

// @todo: Функция удаления карточки
export function deleteCard(evt) {
  const deleteButton = evt.target;
  const card = deleteButton.closest('.card');
  card.remove();
}

// фунция лайка
export function likeCard(evt) {
  const likeButton = evt.target;
  likeButton.classList.toggle('card__like-button_is-active');
}
