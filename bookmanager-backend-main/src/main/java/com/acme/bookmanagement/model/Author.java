package com.acme.bookmanagement.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;

    /**
     * Default constructor for the Author class, it is required by JPA to be able to create 
     * instances of the Author entity when retrieving data from the database.
     */
    protected Author() {
       
    }

    /**
     * Constructor for creation of a new Author object.
     * @param id ID of the author
     * @param name Name of the author
     */
    public Author(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

