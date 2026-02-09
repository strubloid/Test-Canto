package com.acme.bookmanagement.service;

import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.repository.BookRepository;

import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;

    /**
     * Constructor for the BookService class, it will be receiving a BookRepository object as a parameter,
     * this will be used to interact with the database and perform CRUD operations on the Book entity
     * @param bookRepository
     */
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    /**
     * This will be called to retrive all books from the database.
     * @return a list of all books in the database.
     */
    public List<Book> findAll() {                                       
        
        List<Book> booksToReturn;

        // loading the books from the database
        booksToReturn = bookRepository.findAll();

        // if we cant find data, we return an empty list 
        if (booksToReturn == null || booksToReturn.isEmpty()) {
            return List.of();
        }
        
        return booksToReturn;

    }

    /**
     * This method will be called to retrive a specific book by its ID.
     * @param id The ID of the book to retrieve.
     * @return The book with the specified ID, or null if not found.
     */
    public Book findById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found"));
    }

    /**
     * This method will help the parsing of a publishedDate string to become
     * a LocalDate object, this will help to save it correctly in the database
     * and also to be able to do date operations if needed.
     * @param publishedDate The date published as string
     * @return The published date as a LocalDate object
     */
    private LocalDate parsePublishedDate(String publishedDate) {

        // checks if the publishedDate is invalid and throws an exception in that case
        if (publishedDate == null || publishedDate.isBlank()) {
            throw new IllegalArgumentException("publishedDate is required");
        }

        // Getting correct date format by date lenght, if bigger than 10 we take only the date part
        String datePart = publishedDate.length() >= 10 
                        ? publishedDate.substring(0, 10) 
                        : publishedDate;
                        
        return LocalDate.parse(datePart);
    }

    /**
     *  This method will be responsible for creating a new book into the database
     *  we have a basic validation to check if all data is set and things arent empty
     *  before creating a new instance of book.
     *  @param title The title of the book
     *  @param author The author's name
     *  @param publishedDate The day the book was published
     *  @return The created Book object
     */
    public Book createBook(String title, String author, String publishedDate)
    {
        try
        {
            // getting the LocalDate from the string publishedDate
            LocalDate date = parsePublishedDate(publishedDate);

            // creating a new book object with the data, and saving it to database
            Book book = new Book(null, title, author, date);
            
            return bookRepository.save(book);

        }  catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format", e);
        } catch (DataAccessException e) {    
            throw new RuntimeException("Database error while creating book", e);
        }
    }

    /**
     * This method will be responsible for deleting a book from
     * the database by its ID, it will check if exist the book before
     * trying to delete it.
     * @param id ID of the book to delete
     * @return The deleted book object, or null if the book was not found.
     */
    public Book deleteBook(Long id) {
        try {

            // trying to load the book to delete
            Book bookToDelete = findById(id);

            // doing the deletion itself
            bookRepository.delete(bookToDelete);

            // if we cant find the book to delete, we throw an exception
            if(bookToDelete == null) {
                throw new IllegalArgumentException("Book not found");
            }

            return bookToDelete;
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while deleting book", e);
        }
    }
    
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                