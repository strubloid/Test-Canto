import React, { act } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react/pure";
import { Provider } from "react-redux";
import BooksList from "../../components/BooksList";
import booksReducer from "../../features/bookReducer";
import { deleteBook, updateBook } from "../../api/api";

// Mocking the API module to control its behavior in tests
jest.mock("../../api/api");

/**
 * This will be testing the list of books, ensuring that books are rendered
 * and we can be testing all elements in it.
 */
describe("BooksList", () => {
    // Having a configureStore as store instance
    let store: ReturnType<typeof configureStore>;
    let initialState: RootState;

    // before starting we need to add at lease 2 books and configure the store with the booksReducer and initial state.
    beforeEach(() => {
        initialState = {
            books: {
                books: [
                    { id: 1, title: "Book One", authorName: "Author One", publishedDate: "2021-01-01" },
                    { id: 2, title: "Book Two", authorName: "Author Two", publishedDate: "2022-02-02" },
                ],
            },
        };
        store = configureStore({
            reducer: {
                books: booksReducer,
            },
            preloadedState: initialState,
        });
    });

    /**
     * This test will be checkinf if we can render the table rows with the books we have
     * in the initial state, ensuring that the book titles, authors and published date are correct.
     */
    it("renders the table rows", () => {
        // Rendering the BooksList component wrapped in the Redux Provider
        act(() => {
            render(
                <Provider store={store}>
                    <BooksList />
                </Provider>,
            );
        });

        // checking each detail of the booklist
        expect(screen.getByText("Books")).toBeInTheDocument();
        expect(screen.getByText("Book One")).toBeInTheDocument();
        expect(screen.getByText("Author One")).toBeInTheDocument();
        expect(screen.getByText("Book Two")).toBeInTheDocument();
        expect(screen.getByText("Author Two")).toBeInTheDocument();
    });

    /**
     * This will be testing when we are on the edit mode of a book, and we click to cancel,
     * this should expect the fields to be cleared and the edit mode to be closed.
     */
    it("enters edit mode and cancels", () => {
        // Rendering the BooksList component wrapped in the Redux Provider
        act(() => {
            render(
                <Provider store={store}>
                    <BooksList />
                </Provider>,
            );
        });

        // we need to have edit and delete buttons to ensure we can click
        expect(screen.getAllByText("Edit")[0]).toBeInTheDocument();
        expect(screen.getAllByText("Delete")[0]).toBeInTheDocument();

        // clicking in the edit button of the first book [0]
        act(() => {
            fireEvent.click(screen.getAllByText("Edit")[0]);
        });

        // checking each element that was shown, to be in the document existent now
        expect(screen.getByDisplayValue("Book One")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Author One")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2021-01-01")).toBeInTheDocument();

        // we click to cancel
        act(() => {
            fireEvent.click(screen.getByText("Cancel"));
        });

        // after canceling, we should not have the inputs in the document, as we are out of the edit mode
        expect(screen.queryByDisplayValue("Book One")).not.toBeInTheDocument();
        expect(screen.queryByDisplayValue("Author One")).not.toBeInTheDocument();
        expect(screen.queryByDisplayValue("2021-01-01")).not.toBeInTheDocument();
        expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
        expect(screen.queryByText("Save")).not.toBeInTheDocument();
    });

    /**
     * This will be testing the delete action, when we click to delete a book, this
     * should call the deleteBook API with the correct book ID, and we can check if
     * the API was called with the correct parameters.
     */
    it("calls delete on delete click", async () => {

        // creating a mocked response for the deleteBook API
        (deleteBook as jest.Mock).mockResolvedValue(1);

        // Rendering the BooksList component wrapped in the Redux Provider
        act(() => {
            render(
                <Provider store={store}>
                    <BooksList />
                </Provider>,
            );
        });

        // clicking the delete button of the first book [0]
        await act(async () => {
            fireEvent.click(screen.getAllByText("Delete")[0]);
            await Promise.resolve();
        });

        // we wait for the deleteBook API to be called with the correct book ID, which is 1 for the first book
        await waitFor(() => {
            expect(deleteBook).toHaveBeenCalledWith(1);
        });

        // we also check that the deleteBook API gets the expected value, which is 1 as we mocked it to resolve with 1
        const firstCallResult = (deleteBook as jest.Mock).mock.results[0]?.value;
        await expect(firstCallResult).resolves.toBe(1);
    });
});
