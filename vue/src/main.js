new Vue({
    el: '#app',
    data: {
        column1: [],
        column2: [],
        column3: [],
        newCardTitle: '',
        newCardItems: [
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' },
            { text: '' }
        ],
        column1Locked: false,
        column2Full1: false
    },


    mounted() {
        if (localStorage.getItem('notes')) {
            const savedData = JSON.parse(localStorage.getItem('notes'));
            this.column1 = savedData.column1;
            this.column2 = savedData.column2;
            this.column3 = savedData.column3;
            this.column1Locked = savedData.column1Locked;
            this.column2Full1 =  savedData.column2Full1;
        }
    },
    methods: {
        addCard() {
            if (this.newCardTitle.trim() !== '') {
                if (this.column2Full) {
                    alert("Нельзя добавить карточку во второй столбец из-за достижения лимита.");
                    return;
                }

                const filledItems = this.newCardItems.filter(item => item.text.trim() !== '');
                if (filledItems.length < 3) {
                    alert("Необходимо заполнить не менее трех пунктов списка.");
                    return;
                }

                if (!this.column1Locked && this.column1.length < 3) {
                    this.column1.push({
                        title: this.newCardTitle,
                        items: filledItems
                    });
                } else {
                    alert("Нельзя добавить карточку в первый столбец из-за блокировки или достижения лимита.");
                    return;
                }
                this.newCardTitle = '';
                this.newCardItems = [
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' },
                    { text: '' }
                ];

                // Проверяем количество карточек во втором столбце перед сохранением
                if (this.column2.length < 5) {
                    this.column1Locked = false; // Разблокируем первый столбец
                }

                localStorage.setItem('notes', JSON.stringify({
                    column1: this.column1,
                    column2: this.column2,
                    column3: this.column3,
                    column1Locked: this.column1Locked,
                }));
            }
        },



        checkItem(card) {
            if (this.column1Locked) {
                return; // Если столбик заблокан, то уже се
            }
            this.column2Full1 = false;

            const checkedCount = card.items.filter(item => item.checked).length;
            const totalCount = card.items.length;
            const completionPercentage = (checkedCount / totalCount) * 100;

            // Проверка выполнения карточки на 50% и перемещение во второй столбец при условии, что во втором столбце еще есть место
            if (completionPercentage >= 50 && this.column1.includes(card)) {
                if (this.column2.length < 5) {
                    this.moveCardToSecondColumn(card);
                } else {
                    this.column2Full1 = true;
                    alert("Нельзя переместить карточку во второй столбец из-за достижения лимита.");
                    return;
                }
            }

            // Блокировка первого столбца при достижении лимита во втором столбце
            if (this.column1Locked && this.column2.length === 5 && completionPercentage >= 50) {
                this.column2Full1 = true;
            }

            // Блокировка карточки при выполнении на 50% в первом столбце
            if (completionPercentage >= 50 && this.column1.includes(card)) {
                this.column1Locked = true;
            }

            // Разблокировка первого столбца при выполнении на менее чем 50% в карточке, уже находящейся во втором столбце
            if (completionPercentage < 50 && this.column2.includes(card) && this.column1.length < 3) {
                this.column1Locked = false;
            }

            // Перемещение карточки из первого во второй столбец при разблокировке второго столбца
            if (this.column2Full1 === false && this.column2.length < 5 && this.column2Full1 && this.column1.includes(card)) {
                this.moveCardToSecondColumn(card);
            }

            // Если второй столбец разблокирован, проверяем первый столбец на карточки выполненные на 50% и более и перемещаем их во второй столбец
            if (!this.column2Full1) {
                this.checkAndMoveCards();
            }





            // Проверка на перенос карточки из 3 столбца во 2
            if (completionPercentage >= 50 && this.column3.includes(card)) {
                if (this.column2.length < 5) {
                    const index = this.column3.indexOf(card);
                    this.column3.splice(index, 1);
                    this.column2.push(card);
                } else {
                    alert("Нельзя переместить карточку из третьего столбца во второй столбец из-за заполненности второго столбца.");
                    return;
                }
            }
            if (completionPercentage < 50 && this.column2.includes(card) && this.column1.length < 3){
                const index1 = this.column2.indexOf(card);
                this.column2.splice(index1, 1);
                this.column1.push(card);
            }

            if (completionPercentage < 100) {
                card.completed = false;
            }

            if (completionPercentage === 100 && !this.column3.includes(card)) {
                card.completed = true;
                card.lastCompleted = new Date().toLocaleString();
                if (this.column2.includes(card)) {
                    this.column2.splice(this.column2.indexOf(card), 1);
                }
                this.column3.push(card);
            } else if (completionPercentage === 100 && this.column3.includes(card)) {
                card.lastCompleted = new Date().toLocaleString();
            } else {
                card.lastCompleted = "";
            }

            if (completionPercentage < 100 && this.column3.includes(card)) {
                const index = this.column3.indexOf(card);
                this.column3.splice(index, 1);
                this.column2.push(card);
            }

            localStorage.setItem('notes', JSON.stringify({
                column1: this.column1,
                column2: this.column2,
                column3: this.column3,
                column1Locked: this.column1Locked,
                column2Full1: this.column2Full1
            }));
        },

        moveCardToSecondColumn(card) {
            const index = this.column1.indexOf(card);
            if (index !== -1) {
                this.column1.splice(index, 1);
                this.column2.push(card);
            }
        },

// Метод для проверки и перемещения карточек из первого во второй столбец
        checkAndMoveCards() {
            for (let i = this.column1.length - 1; i >= 0; i--) {
                const card = this.column1[i];
                const checkedCount = card.items.filter(item => item.checked).length;
                const totalCount = card.items.length;
                const completionPercentage = (checkedCount / totalCount) * 100;

                if (completionPercentage >= 50) {
                    this.moveCardToSecondColumn(card);
                }
            }
            // Перезагрузка страницы после перемещения карточек (если что включить)
            //location.reload();
        },

        updateItemText(card, item, newText) {
            if (this.column1Locked) {
                return;
            }

            item.text = newText;
            localStorage.setItem('notes', JSON.stringify({
                column1: this.column1,
                column2: this.column2,
                column3: this.column3,
                column1Locked: this.column1Locked,
            }));
        },

        resetAllCards() {
            this.column1 = [];
            this.column2 = [];
            this.column3 = [];
            this.column1Locked = false;
            localStorage.removeItem('notes');
            localStorage.setItem('notes', JSON.stringify({
                column1: this.column1,
                column2: this.column2,
                column3: this.column3,
                column1Locked: this.column1Locked,
                column2Full1: this.column2Full1
            }));
        },
        
        // Метод для перемещения всех карточек из первого столбца в третий
        moveToThirdColumn() {
            for (const card of this.column1) {
                // Отмечаем все пункты карточки как выполненные
                for (const item of card.items) {
                    item.checked = true;
                }
                // Перемещаем карточку в третий столбец
                this.column3.push(card);
            }
            // Очищаем первый столбец
            this.column1 = [];

            for (const card of this.column2) {
                // Отмечаем все пункты карточки как выполненные
                for (const item of card.items) {
                    item.checked = true;
                }
                // Перемещаем карточку в третий столбец
                this.column3.push(card);
            }
            // Очищаем первый столбец
            this.column2 = [];

            // Обновляем состояние в localStorage
            this.saveDataToLocalStorage();
        },
        // Метод для сохранения данных в Local Storage
        saveDataToLocalStorage() {
            localStorage.setItem('notes', JSON.stringify({
                column1: this.column1,
                column2: this.column2,
                column3: this.column3,
                column1Locked: this.column1Locked,
                column2Full1: this.column2Full1
            }));
        },
    }
});
