package com.acme.bookmanagement.repository;

import com.acme.bookmanagement.model.Author;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * This interface will be used to interact with the database and
 * perform CRUD operations on the Author entity.
 */
public interface AuthorRepository extends JpaRepository<Author, Long> {
    Optional<Author> findByName(String name);
}