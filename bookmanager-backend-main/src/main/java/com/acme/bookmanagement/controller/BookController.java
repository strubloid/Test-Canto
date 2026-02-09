package com.acme.bookmanagement.controller;

import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.service.BookService;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/graphql")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    /**
     * This method will be checking if is a valid book data before doing any action.
     */
    private boolean isValidBookData(String title, String author, String publishedDate) {
        return title != null && !title.isEmpty() &&  author != null && !author.isEmpty() && publishedDate != null && !publishedDate.isEmpty();
    }

    /**
     * This method will be called to retrieve all books from the database, it will return a list of all books available.
     * @return
     */
    @QueryMapping
    public List<Book> findAllBooks() {

        List<Book> books;

        // loading the books
        books = bookService.findAll();

        // checking if is an empty one, so we return and empty list
        if (books == null || books.isEmpty()) {
            return List.of();
        }

        return books;
    }

    /**
     * This method will be called to retrieve a specific book by its ID, 
     * it will return the book with the specified ID, or null if not found.
     * @param id Id of the book
     * @return The book with the specified ID, or null if not found.
     */
    @QueryMapping
    public Book findBookById(@Argument Long id) {
        return bookService.findById(id);
    }

    /**
     * This method will be called to create a new book in the database, this will be checking
     * if all book data is valid before calling the service to create a new book.
     * @param title title of the book
     * @param author author's name
     * @param publishedDate pulished date as a string
     * @return a book object with the data of the created book
     */
    @MutationMapping
    public Book createBook(@Argument String title, @Argument String author, @Argument String publishedDate) {

        // Validation of the book data before creating a new book
        if (!isValidBookData(title, author, publishedDate)) {
            throw new IllegalArgumentException("Invalid book data");
        }

        return bookService.createBook(title, author, publishedDate);
    }

    /**
     * This method will call the book service to delete a book by its ID.
     * @param id ID of the book to delete
     * @return The deleted book object, or null if the book was not found.
     */
    @MutationMapping
    public Book deleteBook(@Argument Long id) {
        return bookService.deleteBook(id);
    }

    /**
     * This will be responsible for filtering the book data by the published date
     * it will be receiving a string of the date and it will be returning a list of books
     * that match with that published date.
     * @param publishedDate The published date as a string to filter the books
     * @return A list of books that match with the published date, or an empty list if no books are found.
     */
    @QueryMapping
    public List<Book> findBooksByPublishedDate(@Argument String publishedDate) {

        try {
            // This will be validating before trying to filter the books
            validatePublishedDate(publishedDate);

            return bookService.findByPublishedDate(publishedDate);

        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid published date format", e);
        }
    }

    /**
     * This method will be responsible for validating the published date string, it will be checking if the date format is valid.
     * @param publishedDate The published date as a string to validate
     */
    private void validatePublishedDate(String publishedDate) {

        // first validation of if isnt null or empty
        if (publishedDate == null || publishedDate.isEmpty()) {
            throw new IllegalArgumentException("Published date cannot be null or empty");
        }

        // second validation is for the date format, must exist a valid one
        if(!publishedDate.matches("\\d{4}-\\d{2}-\\d{2}")) {
            throw new IllegalArgumentException("Published date must be in the format YYYY-MM-DD");
        }
    }
}
