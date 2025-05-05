//-----------фунция создания карточки--------------

export function createCard(
  object,
  cardElement,
  showImageFunction,
  userId,
  askBeforeDeleteCard,
  likeCardRequest,
  disLikeCardRequest
) {
  const clonedElement = cardElement.cloneNode(true);
  clonedElement._id = object._id;
  const cardImage = clonedElement.querySelector('.card__image');
  cardImage.src = object.link;
  cardImage.alt = object.name;
  cardImage.addEventListener('click', function () {
    showImageFunction(object.link, object.name);
  });
  const likeButton = clonedElement.querySelector('.card__like-button');

  if (
    object.likes.find((myInformationId) => {
      return myInformationId._id === userId;
    })
  ) {
    likeButton.classList.add('card__like-button_is-active');
  }
  likeButton.addEventListener('click', (evt) =>
    likeCard(evt, likeCardRequest, disLikeCardRequest)
  );
  clonedElement.querySelector('.card__title').textContent = object.name;
  const deleteButton = clonedElement.querySelector('.card__delete-button');
  if (object.owner._id === userId) {
    deleteButton.addEventListener('click', () =>
      askBeforeDeleteCard(clonedElement, clonedElement._id)
    );
  } else {
    deleteButton.classList.add('card__delete-button-inactive');
    deleteButton.setAttribute('disabled', true);
  }
  const likesQuantitySpan = clonedElement.querySelector('.likesQuantity');
  if (object.likes.length > 0) {
    likesQuantitySpan.textContent = object.likes.length;
  }
  return clonedElement;
}

//-----------фунция лайка--------------

function likeCard(evt, likeCardRequest, disLikeCardRequest) {
  const likeButton = evt.target;
  const likeContainer = likeButton.parentElement;
  const card = likeContainer.closest('.card');

  if (!card) {
    console.error('Карточка не найдена');
    alert('Ошибка: карточка не найдена.');
    return;
  }

  if (!card._id) {
    console.error('ID карточки не найден');
    alert('Ошибка: ID карточки не найден.');
    return;
  }

  const likesQuantitySpan = likeContainer.querySelector('.likesQuantity');
  if (!likesQuantitySpan) {
    console.error('Элемент для отображения количества лайков не найден');
    return;
  }

  likeButton.disabled = true;

  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const request = isLiked
    ? disLikeCardRequest(card._id)
    : likeCardRequest(card._id);

  request
    .then((object) => {
      if (object.likes.length > 0) {
        likesQuantitySpan.textContent = object.likes.length;
      } else {
        likesQuantitySpan.textContent = '';
      }
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch((error) => {
      console.error(error);
      alert('Не удалось изменить статус лайка. Попробуйте снова.');
    })
    .finally(() => {
      likeButton.disabled = false;
    });
}
