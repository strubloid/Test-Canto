package com.acme.bookmanagement.controller;

import com.acme.bookmanagement.model.Author;
import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest;
import org.springframework.graphql.test.tester.GraphQlTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import java.time.LocalDate;
import java.util.*;
import static org.mockito.Mockito.when;

@GraphQlTest(BookController.class)
public class BookControllerTest {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockBean
    private BookService bookService;

    // Hashmap with some books to be used in the tests.
    private final Map<Long, Book> books = new HashMap<>();

    /**
     * This is the main constructor for the Book Controller
     * we are initializing some data here to be used in the tests.
     */
    public BookControllerTest() {

        books.put(1L, new Book(
            1L,
            "title-1",
            new Author(1L, "author-1"),
            LocalDate.of(2021, 2, 3))
        );

        books.put(2L, new Book(
            2L,
            "title-2",
            new Author(2L, "author-2"),
            LocalDate.of(2021, 2, 3))
        );
    }

    /**
     * This will be testing if the findAllBooks query is working correctly
     * we are mocking the bookService to return a list of books, 
     * and then we are executing the query and checking if the response is correct. 
     **/    
    @Test
    void shouldGetAllBooks() {

        // mocking the bookService
        when(this.bookService.findAll())
                .thenReturn(new ArrayList<>(books.values()));

        var jsonToTest = """
            [
                {
                    "id": 1,
                    "title": "title-1",
                    "author": { "name": "author-1" },
                    "publishedDate": "2021-02-03"
                },
                {
                    "id": 2,
                    "title": "title-2",
                    "author": { "name": "author-2" },
                    "publishedDate": "2021-02-03"
                }
            ]
        """;

        // executing the query and checking the response
        this.graphQlTester.documentName("findAllBooks")
                .execute()
                .path("findAllBooks")
                .matchesJson(jsonToTest);
    }
}