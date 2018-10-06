var newItemButton = document.getElementById('addTaskButton');
var taskList = document.getElementById('tasks');
var searchBar = document.getElementById('search');
var items = getItems();
var lastId = 4;

// Creating items
items.forEach(function(item){
  appendItemToDOM(item);
});

// Listener for 'Create Task' button
newItemButton.addEventListener('click', newItemButtonHandler);

searchBar.addEventListener('keyup', function(event){
  var searchText = event.target.value;
  
  var filtered = items.filter(function(item) {
    var itemName = item.name.toLowerCase();
    var itemDescription = item.description.toLowerCase();

    return(
      itemName.includes(searchText.toLowerCase()) ||
      itemDescription.includes(searchText.toLowerCase())
    );
  });

  taskList.innerHTML = '';

  filtered.forEach(function(item) {
    appendItemToDOM(item);
  });
});


////////////////
// FUNCTIONS //
//////////////

function appendItemToDOM(item) {
  if (item.name !== '') {
    var newTask = document.createElement('DIV');
    newTask.classList.add('item');
    if(item.completed) { newTask.classList.add('completed'); }
    newTask.id = 'item-' + item.id;

    var newInput = document.createElement('INPUT');
    newInput.setAttribute('type', 'checkbox');
    newInput.checked = item.completed;
    newInput.id = 'item-input-' + item.id;
    
    var newLabel = document.createElement('LABEL');
    newLabel.innerHTML = item.name;
    newLabel.setAttribute('for', newInput.id);
    newLabel.classList.add('name');
   
    var description = document.createElement('P');
    description.classList.add('description');
    description.innerHTML = item.description;

    var deleteButton = document.createElement('BUTTON');
    deleteButton.innerHTML = 'x';
    deleteButton.classList.add('delete');

    var editButton = document.createElement('BUTTON');
    editButton.innerHTML = 'Ред.';
    editButton.classList.add('edit');

    newTask.appendChild(newInput);
    newTask.appendChild(newLabel);
    newTask.appendChild(description);
    newTask.appendChild(deleteButton);
    newTask.appendChild(editButton);

    taskList.appendChild(newTask);

    addListenersForItem(newTask);
  }
}

function getItems() {
  var arr = [
    {name: 'Сходить в магазин', description: 'Купить хлеб, молоко, масло', id: 1, completed: true},
    {name: 'Отправить email', description: 'до 05.05.2018', id: 2, completed: false},
    {name: 'Встретиться с Женей', description: 'Вернуть документы', id: 3, completed: false},
    {name: 'Прием у врача', description: 'Среда, 17.30', id: 4, completed: false},
  ];

  return arr;
}

function deleteItem(itemId) {
  var index = items.findIndex(function(item) {
    return(('item-' + item.id) == itemId);
  });
  
  items.splice(index, 1);

  taskList.removeChild(document.getElementById(itemId));
}

function addListenersForItem(itemTag) {
  setDeleteButtonListener(itemTag);
  setCheckboxChangeListener(itemTag);
  setEditButtonListener(itemTag);
}

function setDeleteButtonListener(itemTag) {
  var deleteButton = itemTag.querySelector('.delete');
  
  deleteButton.addEventListener('click', function(event){
    var id = event.target.parentNode.id;
    deleteItem(id);
  });
}

function setCheckboxChangeListener(itemTag) {
  var checkbox = itemTag.querySelector('input[type=checkbox]');

  checkbox.addEventListener('change', function(){
    var item = findItemByTagId(itemTag.id);

    if (checkbox.checked) {
      itemTag.classList.add('completed');
      item.completed = true;
    } else {
      itemTag.classList.remove('completed');
      item.completed = false;
    }
  });
}


function setEditButtonListener(itemTag) {
  var editButton = itemTag.querySelector('.edit');

  editButton.addEventListener('click', function(){
    if(!itemTag.classList.contains('is-edited')) {
      itemTag.classList.add('is-edited');
      var nameTag = itemTag.querySelector('.name');
      var descriptionTag = itemTag.querySelector('.description');
      
      nameTag.style.display = 'none';
      descriptionTag.style.display = 'none';

      var editNameInput = document.createElement('INPUT');
      var editDescriptionTextarea = document.createElement('TEXTAREA');
      var addEditInfoButton = document.createElement('BUTTON');
      addEditInfoButton.innerHTML = 'Подтвердить';

      editNameInput.classList.add('pretty-input', 'edit-name');
      editDescriptionTextarea.classList.add('pretty-textarea');

      var item = findItemByTagId(itemTag.id);
      editNameInput.value = item.name;
      editDescriptionTextarea.value = item.description;

      itemTag.insertBefore(editNameInput, nameTag);
      itemTag.insertBefore(editDescriptionTextarea, descriptionTag);
      itemTag.appendChild(addEditInfoButton);
      
      addEditInfoButton.addEventListener('click', function(){
        nameTag.innerHTML = editNameInput.value;
        descriptionTag.innerHTML = editDescriptionTextarea.value;

        item.name = editNameInput.value;
        item.description = editDescriptionTextarea.value;

        nameTag.style.display = 'block';
        descriptionTag.style.display = 'block';

        itemTag.removeChild(editNameInput);
        itemTag.removeChild(editDescriptionTextarea);
        itemTag.removeChild(addEditInfoButton);

        itemTag.classList.remove('is-edited');
      });
    }
  });
}

function newItemButtonHandler() {
  var name = document.getElementById('addTask').value.trim();
  var description = document.getElementById('addDescription').value.trim();

  var item = {
    name: name,
    description: description,
    id: lastId += 1,
  };

  items.push(item);

  appendItemToDOM(item);
}

// Tag id looks like thid 'item-:id:' 
function findItemByTagId(tagId) {
  return (
    items.find(function(item) {
      return(('item-' + item.id) == tagId);
    })
  );
}
  