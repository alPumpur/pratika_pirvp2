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
        moveToColumn2(card.id);
    } else if (completionPercentage === 100) {
        moveToColumn3(card.id);
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
        alert('Maximum cards reached in Column 1');
        return;
    }
    if (columnId === 'column2' && columnCardsCount >= 5) {
        alert('Maximum cards reached in Column 2');
        return;
    }

    // Create new card element
    const newCard = document.createElement('div');
    const cardId = uuid(); // Generate unique ID for the card
    newCard.id = cardId;
    newCard.classList.add('card');
    newCard.innerHTML =
        `<h3>New Card</h3>
    <ul>
        <li><input type="checkbox"> Task 1</li>
        <li><input type="checkbox"> Task 2</li>
        <li><input type="checkbox"> Task 3</li>
    </ul>`;

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