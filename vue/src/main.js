const app = new Vue({
    el: '#app',
    data: {
        column1: [
            {
                title: 'List 1',
                items: [
                    { text: 'Item 1', completed: false },
                    { text: 'Item 2', completed: false },
                    { text: 'Item 3', completed: false }
                ]
            }
        ],
        column2: [
            {
                title: 'List 2',
                items: [
                    { text: 'Item 1', completed: false },
                    { text: 'Item 2', completed: false },
                    { text: 'Item 3', completed: false },
                    { text: 'Item 4', completed: false },
                    { text: 'Item 5', completed: false }
                ]
            }
        ],
        column3: []
    },
    methods: {
        checkCompletion(card) {
            const totalItems = card.items.length;
            const completedItems = card.items.filter(item => item.completed).length;
            const completionPercentage = (completedItems / totalItems) * 100;

            if (completionPercentage >= 50 && completionPercentage < 100) {
                if (!this.column2.find(c => c === card)) {
                    this.column2.push(card);
                    const index = this.column1.findIndex(c => c === card);
                    this.column1.splice(index, 1);
                }
            } else if (completionPercentage === 100) {
                const index = this.column2.findIndex(c => c === card);
                if (index !== -1) {
                    this.column2.splice(index, 1);
                }
                this.column3.push({
                    title: card.title,
                    items: card.items,
                    completed: true,
                    completedDate: new Date().toLocaleString()
                });
            }
        }
    }
});