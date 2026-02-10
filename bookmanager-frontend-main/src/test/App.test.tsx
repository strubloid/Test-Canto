import React, { act } from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react/pure";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import App from "../App";
import booksReducer from "../features/bookReducer";
import { fetchBooks } from "../api/api";

// Mocking the fetchBooks function to control its behavior in tests
jest.mock("../api/api");

/**
 * This is the basic App test, to ensure that things are rendered and the initial fetchBooks call is made.
 */
describe("App", () => {
    // Checking if we can render the App component and fetch the books
    it("renders the Book Management header", async () => {
        // Mocking the fetchBooks
        (fetchBooks as jest.Mock).mockResolvedValue([]);

        // Setting up the Redux store for the test
        const store = configureStore({
            reducer: {
                books: booksReducer,
            },
        });

        // Rendering the App component wrapped in the Redux Provider
        await act(async () => {
            render(
                <Provider store={store}>
                    <App />
                </Provider>,
            );
        });

        // I should be able to see the header Book Management to ensure the header is rendered
        expect(screen.getByText("Book Management")).toBeInTheDocument();

        // I should also ensure that the fetchBooks function is called to load the initial data
        await waitFor(() => {
            expect(fetchBooks).toHaveBeenCalled();
        });
    });
});
