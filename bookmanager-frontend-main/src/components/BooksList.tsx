import React, { useEffect, useId, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Book } from "../features/bookReducer";
import CollapseIndicator from "./CollapseIndicator";
import "./BooksList.css";

// defining the type for avaiable values to be sorted in the book list.
type SortKey = "id" | "title" | "authorName" | "publishedDate";

/**
 * This will be responsible for displaying the list of books in the backend
 * we will be able to:
 * 1 - Display the list of books with their title, author and published date.
 * 2 - We will be able to sort the list of books by title, author and published date.
 * 3 - We will be able to filter the list of books by title, author and published date.
 * 4 - We will be able to search the list of books by title, author and published date.
 * 5 - We will be able to delete a book from the list of books.
 * 6 - We will be able to edit a book from the list of books.
 * @returns
 */
const BooksList = () => {
    // we get the list of books from the Redux store
    const books = useSelector((state: RootState) => state.books.books);
    const contentId = useId();
    const [isOpen, setIsOpen] = useState(true);

    // sort key and direction state
    const [sortKey, setSortKey] = useState<SortKey>("title");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // pagination state
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // getting the range of books ad the current page
    const sortedBooks = React.useMemo<Book[]>(() => {
        // getting a copy of the books array
        const copy = [...books];

        // sorting the copy of the books array based on the sort key and direction
        copy.sort((bookA, bookB) => {
            let result = 0;

            // checking for the sort key and sorting accordingly
            if (sortKey == "publishedDate") {
                const timeA = Date.parse(bookA.publishedDate);
                const timeB = Date.parse(bookB.publishedDate);
                result = timeA - timeB;
            } else if (sortKey === "id") {
                result = bookA.id - bookB.id;
            } else {
                const valueA = String(bookA[sortKey] ?? "");
                const valueB = String(bookB[sortKey] ?? "");

                // we use localeCompare to compare the string values for title and authorName
                result = valueA.localeCompare(valueB);
            }

            // we define the direction of the sort
            return sortDir === "asc" ? result : -result;
        });

        return copy;
    }, [books, sortKey, sortDir]);

    // table configuration
    const totalPages = Math.max(1, Math.ceil(sortedBooks.length / pageSize));
    const startIndex = (page - 1) * pageSize;
    const pageBooks = sortedBooks.slice(startIndex, startIndex + pageSize);
    const showingFrom = sortedBooks.length === 0 ? 0 : startIndex + 1;
    const showingTo = Math.min(startIndex + pageSize, sortedBooks.length);

    // this will be responsible for handling the start of the
    // sort action by adding the first time page = 1
    useEffect(() => {
        setPage(1);
    }, [sortKey, sortDir]);

    // this will be responsible for handling the case of changing the page and we are on a page
    // that is greater than the total pages, so we set the page to the total pages.
    useEffect(() => {
        // only update the page if the current page is greater than
        // the total of pages
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    /**
     * This will be responsible for handling the sort action by
     * changing the sort key and the direction of the sort based on the current state.
     * @param key the key to sort by, it can be either title, authorName or publishedDate
     * @returns
     */
    const sortingBy = (key: SortKey) => {
        // if we are sorting by the same key, we change the direction of the sort
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
            return;
        }

        // otherwise, we set the new sort key and we set the direction to ascending
        setSortKey(key);
        setSortDir("asc");
    };

    /**
     * Visual indicator for the sort direction, just adding a simple arrow up
     * to show that we are sorting asc or desc based on the current sort key and direction.
     * @param key the key to check if we are sorting by it
     * @returns
     */
    const sortIndicator = (key: SortKey) => (key === sortKey ? (sortDir === "asc" ? " ^" : " v") : "");

    /**
     * This is to format in a better way the published date of the book,
     * as in the database contain a different order, here we make sure we show
     * in a more user friendly way.
     * @param value the date string to format
     * @returns a formatted date string or the original value if invalid
     */
    const formatDate = (value: string) => {
        let result: string;

        // checking if is empty or null
        if (!value) {
            result = "-";
            return result;
        }

        // parsing the date and checking if is valid to format it or just return the original
        const parsed = new Date(value);
        result = Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();

        return result;
    };

    return (
        <section className="books">
            <div className="books-body">
                <div className="books-header">
                    <div>
                        <button type="button" className="books-toggle" aria-expanded={isOpen} aria-controls={contentId} onClick={() => setIsOpen((prev) => !prev)}>
                            <span className="books-title">Books</span>
                            <CollapseIndicator isOpen={isOpen} />
                        </button>
                        <p className="books-subtitle">
                            Showing {showingFrom}-{showingTo} of {sortedBooks.length}
                        </p>
                    </div>
                </div>

                <div id={contentId} className={`books-collapse ${isOpen ? "is-open" : ""}`}>
                    <div className="books-collapse-inner">
                        <div className="books-table-wrap">
                            <table className="books-table">
                                <thead>
                                    <tr>
                                        <th scope="col" aria-sort={sortKey === "id" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("id")}>
                                                ID{sortIndicator("id")}
                                            </button>
                                        </th>
                                        <th scope="col" aria-sort={sortKey === "title" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("title")}>
                                                Title{sortIndicator("title")}
                                            </button>
                                        </th>
                                        <th scope="col" aria-sort={sortKey === "authorName" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("authorName")}>
                                                Author{sortIndicator("authorName")}
                                            </button>
                                        </th>
                                        <th scope="col" aria-sort={sortKey === "publishedDate" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                                            <button type="button" className="books-sort" onClick={() => sortingBy("publishedDate")}>
                                                Published{sortIndicator("publishedDate")}
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageBooks.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="books-empty">
                                                No books yet. Add your first one above.
                                            </td>
                                        </tr>
                                    ) : (
                                        pageBooks.map((book) => (
                                            <tr key={book.id}>
                                                <td>{book.id}</td>
                                                <td>{book.title}</td>
                                                <td>{book.authorName}</td>
                                                <td>{formatDate(book.publishedDate)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <nav className="books-pagination" aria-label="Books pagination">
                                <button className="books-page" onClick={() => setPage(page - 1)} type="button" disabled={page === 1}>
                                    Prev
                                </button>
                                <div className="books-page-list">
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            className={`books-page ${pageNumber === page ? "is-active" : ""}`}
                                            onClick={() => setPage(pageNumber)}
                                            type="button"
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>
                                <button className="books-page" onClick={() => setPage(page + 1)} type="button" disabled={page === totalPages}>
                                    Next
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BooksList;
