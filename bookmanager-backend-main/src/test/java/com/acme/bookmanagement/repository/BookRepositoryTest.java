package com.acme.bookmanagement.repository;

import com.acme.bookmanagement.model.Author;
import com.acme.bookmanagement.model.Book;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@DataJpaTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class BookRepositoryTest {

    @Autowired
    private BookRepository repo;

    @Autowired
    private AuthorRepository authorRepo;
    
    // Book and Author objects to be used in the tests
    private Author author;
    private Book book;

    @BeforeEach
    public void setUp() {
        // we are saving an author and a book in the database to be used in the tests
        author = authorRepo.save(new Author(null, "author-1"));
        book = new Book(null, "title-1", author, LocalDate.of(2021, 2, 3));
        book = repo.save(book);
    }

    /**
     * TearDown function is responsible for cleaning up the database
     * after each test. This is important to ensure that each test runs in a clean state
     * and that the results of one test do not affect the others.
     */
    @AfterEach
    public void tearDown() {
        repo.delete(book);
        authorRepo.delete(author);
    }

    /**
     * This test will be checking if a book that we have saved in the database can be retrieved correctly by its ID.
     * We are using the findById method of the repository to retrieve the book, and
     * then we are checking if the retrieved book is not null and if its properties match the ones of the book we saved.
     */
    @Test
    void testSavedBookCanBeFoundById() {

        // first we retrive the book by It's ID
        Book savedBook = repo.findById(book.getId()).orElse(null);

        // we check that isnt null
        assertNotNull(savedBook);

        // we check that each property of the book is the same as the savedBook
        assertEquals(book.getAuthor(), savedBook.getAuthor());
        assertEquals(book.getTitle(), savedBook.getTitle());
        assertEquals(book.getPublishedDate(), savedBook.getPublishedDate());
    }
}
