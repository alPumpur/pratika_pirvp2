const app = new Vue({
    el: '#app',
    data: {
        column1: [
            {
                title: 'Card 1',
                items: [
                    { text: 'Item 1', completed: false },
                    { text: 'Item 2', completed: false },
                    { text: 'Item 3', completed: false }
                ]
            }
        ],
        column2: [
            {
                title: 'Card 2',
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

});