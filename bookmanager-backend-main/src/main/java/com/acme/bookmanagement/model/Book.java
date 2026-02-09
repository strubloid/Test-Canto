package com.acme.bookmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;

@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private LocalDate publishedDate;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;

    /**
     * Default constructor for the Book class, it is required by JPA to be able to create 
     * instances of the Book entity when retrieving data from the database.
     */
    protected Book() {
       
    }

    /**
     * Constructor for the Book class, it will be receiving the title, author and publishedDate as parameters,
     * this will be used to create new instances of the Book entity when creating new books in
     * @param id The ID of the book
     * @param title The title of the book
     * @param author The Author object representing the author of the book
     * @param publishedDate The date when the book was published, as a LocalDate object
     */
    public Book(Long id, String title, Author author, LocalDate publishedDate) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.publishedDate = publishedDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Author getAuthor() {
        return author;
    }
    
    /**
     * Changing from String to Author object,
     * this will be linking the book to an author
     * @param author the Author object to link to this book
     */
    public void setAuthor(Author author) {
        this.author = author;
    }

    public LocalDate getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }
}

