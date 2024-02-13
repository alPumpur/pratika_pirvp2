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

// Example: Move card from column 1 to column 2 when tasks are more than 50% completed
const cardsColumn1 = document.querySelectorAll('#column1 .card');
const cardsColumn2 = document.querySelectorAll('#column2 .card');

cardsColumn1.forEach(card => {
    const cardTasks = card.querySelectorAll('input[type="checkbox"]');
    const totalTasks = cardTasks.length;

    cardTasks.forEach(task => {
        task.addEventListener('change', () => {
            const isChecked = task.checked;
            const listItem = task.parentElement;
            if (isChecked) {
                listItem.classList.add('completed');
            } else {
                listItem.classList.remove('completed');
            }
            const completedTasks = card.querySelectorAll('input[type="checkbox"]:checked').length;
            const completionPercentage = (completedTasks / totalTasks) * 100;
            if (completionPercentage >= 50) {
                toggleColumn1Disabled(true);
            }
            if (completionPercentage === 100) {
                toggleColumn1Disabled(false);


                moveToColumn2(card.id);
                moveToColumn3(card.id);
            }
        });
    });
});

// Check column 2 completion when any task is checked
cardsColumn2.forEach(card => {
    const cardTasks = card.querySelectorAll('input[type="checkbox"]');
    cardTasks.forEach(task => {
        task.addEventListener('change', () => {
            if (checkAllTasksCompleted(card)) {
                toggleColumn1Disabled(false);
                moveToColumn3(card.id); // Move to column 3 if all tasks completed
            }
        });
    });
});
