package com.acme.bookmanagement.service;

import com.acme.bookmanagement.model.Author;
import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.repository.AuthorRepository;
import com.acme.bookmanagement.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BookServiceTest {

    // repositories book and author are mocked now
    private final AuthorRepository authorRepository = Mockito.mock(AuthorRepository.class);
    private final BookRepository bookRepository = Mockito.mock(BookRepository.class);

    // Book service
    private final BookService bookService = new BookService(bookRepository, authorRepository);

    // Book object to be used in the tests
    private final Book book = new Book(1L, "title-1", new Author(1L, "author-1"), 
        LocalDate.of(2021, 2, 3));

    /**
     * This will be testing the findAll method of the book service,
     * we are mocking the bookRepository to return a list with one book, 
     * and then we are checking if the findAll method of the service returns a list with one book as well.
     */    
    @Test
    void testFindAllSimple() {

        // mocking the bookRepository to return a list with one book
        Mockito.when(bookRepository.findAll()).thenReturn(Collections.singletonList(book));

        // we check that the findAll method of the service returns a list with one book as well
        assertEquals(1, bookService.findAll().size());
    }

    /**
     * This will be testing the findAll method of the book service,
     * we are mocking the bookRepository to return a list with 5 books, 
     * and then we are checking if the findAll method of the service returns a list with five books as well.
     */    
    @Test
    void testFindAll() {

        int quantityOfBooks = 5;
        
        // mocking the bookRepository to return a list with 5 books
        Mockito.when(bookRepository.findAll()).thenReturn(
            Collections.nCopies(quantityOfBooks, book)
        );

        // we check that the findAll method of the service returns a list with five books as well
        assertEquals(quantityOfBooks, bookService.findAll().size());
    }
}
