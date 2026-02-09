package com.acme.bookmanagement.repository;

import com.acme.bookmanagement.model.Book;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByPublishedDate(LocalDate publishedDate);
}

