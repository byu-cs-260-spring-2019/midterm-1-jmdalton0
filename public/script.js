let app = new Vue({
    el: "#app",
    data: {
        query: '',
        loading: false,
        books: [{
            title: 'Your Book',
            author_name: 'Author: John Stamos',
            first_publish_year: '2007',
            image: '',
            isbn: '',
        }],
        favorites: [{
            title: '',
            author_name: '',
            first_publish_year: '',
            image: '',
        }],
    },
    created() {
        this.books.pop();
        this.favorites.pop();
    },

    methods: {
        async searchBook() {
            try {
                const bookURL = 'http://openlibrary.org/search.json?q=' + this.query;

                this.loading = true;

                const response = await axios.get(bookURL);
                console.log(response.data);
                app.books.pop();
                for (var i = 0; i < response.data.docs.length; i++) {
                    const item = response.data.docs[i];
                    const title = item.title;
                    var author_name = '';
                    try {
                        author_name = 'Author: ' + item.author_name[0];
                    } catch (error) {
                        author_name = '';
                    }
                    var first_publish_year = '';
                    if (item.first_publish_year === undefined) {
                        first_publish_year = '';
                    } else {
                        first_publish_year = 'Published: ' + item.first_publish_year;
                    }
                    const ISBN = item.isbn;

                    app.books.push({
                        title: title,
                        author_name: author_name,
                        first_publish_year: first_publish_year,
                        image: '',
                        isbn: ISBN,
                    });
                }

                this.loading = false;

                for (var i = 0; i < this.books.length; i++) {
                    try {
                        const thumbResponse = await axios.get(
                            'https://openlibrary.org/api/books?bibkeys=ISBN:'
                            + this.books[i].isbn
                            + '&jscmd=details&format=json');
                        console.log(thumbResponse);
                        this.books
                    } catch (error) {
                        console.log(error);
                    }
                }

            } catch (error) {
                console.log(error);
            }
        },

        addToFavs(item) {
            if (this.favorites.indexOf(item) === -1)
                this.favorites.push(item);
        },

        remFromFavs(item) {
            var index = this.favorites.indexOf(item);
            if (index > -1)
                this.favorites.splice(index, 1);
        },

    }
})