package com.acme.bookmanagement.repository;

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

    private Book book;

    @BeforeEach
    public void setUp() {
        book = new Book(null,
                "title-1",
                "author-1",
                LocalDate.of(2021, 2, 3));
        book = repo.save(book);
    }

    @AfterEach
    public void tearDown() {
        repo.delete(book);
    }

    @Test
    void testSavedBookCanBeFoundById() {
        Book savedBook = repo.findById(book.getId()).orElse(null);

        assertNotNull(savedBook);
        assertEquals(book.getAuthor(), savedBook.getAuthor());
        assertEquals(book.getTitle(), savedBook.getTitle());
        assertEquals(book.getPublishedDate(), savedBook.getPublishedDate());
    }
}
