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

// Function to add new card dynamically to a specified column
function addNewCard(columnId) {
    const column = document.getElementById(columnId);

    // Check if maximum number of cards in the column is reached
    const columnCardsCount = column.querySelectorAll('.card').length;
    if (columnId === 'column1' && columnCardsCount >= 3) {
        alert('Максимальное количество карточек: 3');
        return;
    }
    if (columnId === 'column2' && columnCardsCount >= 5) {
        alert('Максимальное количество карточек: 5');
        return;
    }

    // Create new card element
    const newCard = document.createElement('div');
    const cardId = uuid(); // Generate unique ID for the card
    newCard.id = cardId;
    newCard.classList.add('card');

    // Prompt user for card title
    const cardTitle = prompt('Введите заголовок карточки:');
    const titleElement = document.createElement('h3');
    titleElement.textContent = cardTitle || 'New Card';
    newCard.appendChild(titleElement);

    // Prompt user for tasks
    const numTasks = prompt('Введите количество заданий (от 3 до 5):');
    const numTasksInt = parseInt(numTasks);
    const numTasksValid = Number.isInteger(numTasksInt) && numTasksInt >= 3 && numTasksInt <= 5;

    if (!numTasksValid) {
        alert('Количество заданий должно быть целым числом от 3 до 5.');
        return;
    }

    const tasksList = document.createElement('ul');
    for (let i = 1; i <= numTasksInt; i++) {
        const taskText = prompt(`Введите текст для задания ${i}:`);
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `<input type="checkbox"> ${taskText || `Task ${i}`}`;
            tasksList.appendChild(taskElement);
            }
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
            }