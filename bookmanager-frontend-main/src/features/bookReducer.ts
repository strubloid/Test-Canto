import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
    id: number;
    title: string;
    authorName: string;
    publishedDate: string;
}

interface BookState {
    books: Book[];
}

const initialState: BookState = {
    books: [],
};

const bookReducer = createSlice({
    name: 'books',
    initialState,
    reducers: {
        setBooks(state, action: PayloadAction<Book[]>) {
            state.books = action.payload;
        },
        addBook(state, action: PayloadAction<Book>) {
            state.books.push(action.payload);
        },
        updateBook(state, action: PayloadAction<Book>) {
            const index = state.books.findIndex((book) => book.id === action.payload.id);
            if (index !== -1) {
                state.books[index] = action.payload;
            }
        },
        deleteBook(state, action: PayloadAction<number>) {
            state.books = state.books.filter(book => book.id !== action.payload);
        },
    },
});

export const { setBooks, addBook, updateBook, deleteBook } = bookReducer.actions;

export default bookReducer.reducer;
