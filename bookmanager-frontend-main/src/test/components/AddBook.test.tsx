import { createBook } from "../../api/api";
import React, { act } from "react";
import { Provider } from "react-redux";
import AddBook from "../../components/AddBook";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "../../features/bookReducer";

// Mocking the API module to control its behavior in tests
jest.mock("../../api/api");

// Mocking the react-datepicker to simplify testing and avoid issues with date handling in tests
jest.mock("react-datepicker", () => {
    const MockDatePicker = ({ selected, onChange, placeholderText, className }: any) => (
        <input
            className={className}
            placeholder={placeholderText}
            value={selected ? selected.toISOString().substring(0, 10) : ""}
            onChange={(event) => onChange(new Date(event.target.value))}
        />
    );

    return MockDatePicker;
});
/**
 * We are testing the AddBook component to ensure
 * when we add a book, the input fields are cleared
 * after the book is added to the backend and the store.
 */
describe("AddBook", () => {
    // Using the configuredStore to create a mock
    let store: ReturnType<typeof configureStore>;

    // Setting up the Redux store before each test
    beforeEach(() => {
        // We create a new store instance for each test to ensure isolation
        store = configureStore({
            reducer: {
                books: booksReducer,
            },
        });

        // Mocking the dispatch function to track dispatched actions
        store.dispatch = jest.fn();

        // adding the mocked response for the createBook API call to ensure it resolves successfully when we add a book
        let mokedValue = { id: 1, title: "Test Book", author: "Test Author", publishedDate: "2026-02-05" };
        (createBook as jest.Mock).mockResolvedValue(mokedValue);
    });

    // Test to ensure that the input fields are cleared after adding a book, tests that
    // the handleAddBook function is working correctly and that the form resets after adding a book
    it("clears inputs when a book is added", async () => {
        // this will help to capture things by the placeholder, as we have some
        let getByPlaceholderText!: (text: string) => HTMLElement;
        let container!: HTMLElement;

        // Rendering the AddBook component wrapped in the Redux Provider
        await act(async () => {
            const utils = render(
                <Provider store={store}>
                    <AddBook />
                </Provider>,
            );
            getByPlaceholderText = utils.getByPlaceholderText;
            container = utils.container;
        });

        // getting all inputfields, some by placeholder other's by query selector
        const titleInput = getByPlaceholderText("e.g. The Great Gatsby");
        const authorInput = getByPlaceholderText("e.g. F. Scott Fitzgerald");
        const publishedDateInput = getByPlaceholderText("dd/mm/yyyy");

        // first test, checking that we have the button there
        const addButton = container.querySelector(".add-book-button") as HTMLButtonElement | null;
        expect(addButton).toBeTruthy();

        // adding the simulation of a book
        await act(async () => {
            fireEvent.change(titleInput, { target: { value: "Test Book" } });
            fireEvent.change(authorInput, { target: { value: "Test Author" } });
            fireEvent.change(publishedDateInput, { target: { value: "2026-02-05" } });
            fireEvent.click(addButton!);
        });

        // waiting for the inputs to be cleared after adding the book
        await waitFor(() => {
            expect(titleInput).toHaveValue("");
            expect(authorInput).toHaveValue("");
            expect(publishedDateInput).toHaveValue("");
        });
    });
});
