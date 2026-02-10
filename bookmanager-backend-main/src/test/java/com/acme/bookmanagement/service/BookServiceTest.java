package com.acme.bookmanagement.service;

import com.acme.bookmanagement.model.Author;
import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.repository.AuthorRepository;
import com.acme.bookmanagement.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

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

    /**
     * This will be testing the findById method of the book service,
     * ensuring the book is returned when it exists.
     */
    @Test
    void testFindById() {

        // mocking the bookRepository to return the book
        Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        // getting the book by its ID (Long)
        Book result = bookService.findById(1L);

        // we check that result is existent
        assertNotNull(result);

        // we check the id, title and author are the same
        assertEquals(book.getId(), result.getId());
        assertEquals(book.getTitle(), result.getTitle());
        assertEquals(book.getAuthor().getName(), result.getAuthor().getName());
    }

    /**
     * This will be testing the findById method of the book service,
     * ensuring an exception is thrown when the book does not exist.
     */
    @Test
    void testFindByIdNotFound() {

        // Mocking the bookRepository to return empty
        Mockito.when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        // we check that an exception is thrown when the book does not exist
        assertThrows(IllegalArgumentException.class, () -> bookService.findById(99L));
    }

    /**
     * This will be testing the createBook method of the book service,
     * ensuring a book is created and saved with a resolved author.
     */
    @Test
    void testCreateBook() {

        // Mocking the author repository to return an existing author
        Author author = new Author(1L, "author-1");
        LocalDate date = LocalDate.of(2022, 1, 10);

        // doing the mock for authorRepository and bookRepository
        Mockito.when(authorRepository.findByName("author-1")).thenReturn(Optional.of(author));
        Mockito.when(bookRepository.save(Mockito.any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // calling the service to create a book
        Book created = bookService.createBook("title-1", "author-1", "2022-01-10");

        // first check is to know the book exists
        assertNotNull(created);

        // we check the title, author and published date are the same as expected
        assertEquals("title-1", created.getTitle());
        assertEquals(author, created.getAuthor());
        assertEquals(date, created.getPublishedDate());
    }

    /**
     * This will be testing the updateBook method of the book service,
     * ensuring an existing book is updated and saved.
     */
    @Test
    void testUpdateBook() {

        // Starting with original and new author data
        Author originalAuthor = new Author(1L, "author-1");
        Author newAuthor = new Author(2L, "author-2");

        // Mocking the book repository to be this existing book
        Book existing = new Book(10L, "old-title", originalAuthor, LocalDate.of(2020, 5, 20));

        // Mocking the repositories for the update process
        Mockito.when(bookRepository.findById(10L)).thenReturn(Optional.of(existing));
        Mockito.when(authorRepository.findByName("author-2")).thenReturn(Optional.of(newAuthor));
        Mockito.when(bookRepository.save(Mockito.any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Calling the book service to update the book with new data
        Book updated = bookService.updateBook(10L, "new-title", "author-2", "2021-06-15");

        // checking if new title, new author and the published date are updated correctly
        assertEquals("new-title", updated.getTitle());
        assertEquals(newAuthor, updated.getAuthor());
        assertEquals(LocalDate.of(2021, 6, 15), updated.getPublishedDate());
    }

    /**
     * This will be testing the deleteBook method of the book service,
     * ensuring the book is deleted and returned.
     */
    @Test
    void testDeleteBook() {

        // Mocking the book repository to return the book to delete
        Mockito.when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        // Calling the book service to delete our book
        Book deleted = bookService.deleteBook(1L);

        // we check that shouldnt be null
        assertNotNull(deleted);

        // we check if the book id is equal to the deleted book id
        assertEquals(book.getId(), deleted.getId());

        // we also verify that the delete method was called only once
        Mockito.verify(bookRepository, Mockito.times(1)).delete(book);
    }

    /**
     * This will be testing the findByPublishedDate method of the book service,
     * ensuring it returns matching books for a valid date.
     */
    @Test
    void testFindByPublishedDate() {

        // we start with a date and a book with that published date
        LocalDate date = LocalDate.of(2021, 2, 3);
        Mockito.when(bookRepository.findByPublishedDate(date)).thenReturn(List.of(book));

        // we use the book service to find books by published date
        List<Book> results = bookService.findByPublishedDate("2021-02-03");

        // we check that the results list has at least one book
        assertEquals(1, results.size());

        // and we check the book in the result has the same id as our book
        assertEquals(book.getId(), results.get(0).getId());
    }

    /**
     * This will be testing the findByPublishedDate method of the book service,
     * ensuring it returns multiple matching books for a valid date.
     */
    @Test
    void testFindByPublishedDateMultipleResults() {

        // we start with a date and multiple books with that published date
        LocalDate date = LocalDate.of(2022, 2, 3);
        Mockito.when(bookRepository.findByPublishedDate(date)).thenReturn(List.of(book, book, book));

        // we use the book service to find books by published date
        List<Book> results = bookService.findByPublishedDate("2022-02-03");

        // we check that the results list has three books
        assertEquals(3, results.size());
    }

    /**
     * This will be testing the findByPublishedDate method of the book service,
     * ensuring an exception is thrown for an invalid date format.
     */
    @Test
    void testFindByPublishedDateInvalidFormat() {
        // we check that an exception is thrown when the date format is invalid
        assertThrows(IllegalArgumentException.class, () -> bookService.findByPublishedDate("invalid-date"));
    }

}
