// Function to move card from column 1 to column 2
function moveToColumn2(cardId) {
    const card = document.getElementById(cardId);
    const column2 = document.getElementById('column2');
    column2.appendChild(card);
}

// Function to move card from column 2 to column 3
function moveToColumn3(cardId) {
    const card = document.getElementById(cardId);
    const column3 = document.getElementById('column3');
    column3.appendChild(card);

    // Add completion timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();
    const completionInfo = document.createElement('p');
    completionInfo.textContent = `Выполнено: ${timestamp}`;
    card.appendChild(completionInfo);
}

// Function to disable or enable column 1
function toggleColumn1Disabled(disabled) {
    const cardsColumn1 = document.querySelectorAll('#column1 .card');
    cardsColumn1.forEach(card => {
        const inputs = card.querySelectorAll('input[type="checkbox"]');
        inputs.forEach(input => {
            input.disabled = disabled;
        });
    });
}

// Function to check if all tasks in a card are completed
function checkAllTasksCompleted(card) {
    const cardTasks = card.querySelectorAll('input[type="checkbox"]');
    return [...cardTasks].every(task => task.checked);
}

// Function to handle task completion and card movement
function handleTaskCompletion(card) {
    const cardTasks = card.querySelectorAll('input[type="checkbox"]');
    const totalTasks = cardTasks.length;

    const completedTasks = card.querySelectorAll('input[type="checkbox"]:checked').length;
    const completionPercentage = (completedTasks / totalTasks) * 100;

    if (completionPercentage >= 50 && completionPercentage < 100) {
        const column2CardsCount = document.querySelectorAll('#column2 .card').length;
        if (column2CardsCount >= 5) {
            toggleColumn1Disabled(true); // Замораживаем первый столбец
        } else {
            moveToColumn2(card.id);
        }
    } else if (completionPercentage === 100) {
        moveToColumn3(card.id);
        toggleColumn1Disabled(false); // Размораживаем первый столбец
    }
}

// Generate unique ID for each card
function uuid() {
    return 'card-' + Math.random().toString(36).substr(2, 9);
}

    function showCardForm(columnId) {
    const cardForm = document.getElementById('cardForm');
    const column = document.getElementById(columnId);
    cardForm.style.display = 'block';
    // Store column id in a hidden input field
    const columnInput = document.createElement('input');
    columnInput.type = 'hidden';
    columnInput.name = 'columnId';
    columnInput.value = columnId;
    cardForm.appendChild(columnInput);
}

    function hideCardForm() {
    const cardForm = document.getElementById('cardForm');
    cardForm.style.display = 'none';
    // Clear form fields
    document.getElementById('cardTitle').value = '';
    for (let i = 1; i <= 5; i++) {
    document.getElementById(`task${i}`).value = '';
}
}

    function addNewCard() {
    const cardTitle = document.getElementById('cardTitle').value;
    const tasks = [];
    for (let i = 1; i <= 5; i++) {
    const taskInput = document.getElementById(`task${i}`).value;
    if (taskInput.trim() !== '') {
    tasks.push(taskInput);
}
}
    if (tasks.length < 3) {
    alert('Необходимо заполнить как минимум три пункта.');
    return;
}

    const columnId = document.querySelector('#cardForm [name="columnId"]').value;
    const column = document.getElementById(columnId);

    // Create new card element
    const newCard = document.createElement('div');
    const cardId = uuid(); // Generate unique ID for the card
    newCard.id = cardId;
    newCard.classList.add('card');

    // Set card title
    const titleElement = document.createElement('h3');
    titleElement.textContent = cardTitle || 'New Card';
    newCard.appendChild(titleElement);

    // Create tasks list
    const tasksList = document.createElement('ul');
    tasks.forEach((taskText, index) => {
    const taskElement = document.createElement('li');
    taskElement.innerHTML = `<input type="checkbox"> ${taskText}`;
    tasksList.appendChild(taskElement);
    });
    newCard.appendChild(tasksList);

    // Add task completion event listener
    const cardTasks = newCard.querySelectorAll('input[type="checkbox"]');
    cardTasks.forEach(task => {
    task.addEventListener('change', () => {
        handleTaskCompletion(newCard);
    });
});

    // Add new card to the specified column
    column.appendChild(newCard);
    hideCardForm();
    }


