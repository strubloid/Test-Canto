// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

/**
 * This is necessary to properly use the `act` function from React Testing Library in our tests.
 * It ensures that all updates related to React components are properly flushed and handled during testing.
 */
jest.mock("react-dom/test-utils", () => {
    const { act } = require("react");
    return {
        ...jest.requireActual("react-dom/test-utils"),
        act,
    };
});
