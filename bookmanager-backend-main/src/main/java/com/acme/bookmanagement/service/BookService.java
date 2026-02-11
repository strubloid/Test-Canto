package com.acme.bookmanagement.service;

import com.acme.bookmanagement.model.Book;
import com.acme.bookmanagement.repository.BookRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import com.acme.bookmanagement.model.Author;
import com.acme.bookmanagement.repository.AuthorRepository;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    /**
     * Constructor for the BookService class, it will be receiving a BookRepository object as a parameter,
     * this will be used to interact with the database and perform CRUD operations on the Book entity
     * @param bookRepository
     */
    public BookService(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
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
     * This will be responsible to get an Author object or if does 
     * not exist, we create a new one with the name provided.
     * @param name The name of the author
     * @return The Author object
     */
    private Author getOrCreateAuthor(String name) {

        // basic validation check 
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("author is required");
        }
    
        return authorRepository.findByName(name.trim())
                .orElseGet(() -> authorRepository.save(new Author(null, name.trim())));
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
    public Book createBook(String title, String authorName, String publishedDate)
    {
        try
        {
            // getting the LocalDate from the string publishedDate
            LocalDate date = parsePublishedDate(publishedDate);

            // Loading or creating the author with the name provided
            Author author = getOrCreateAuthor(authorName);

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
     * This is similar to the add book but this one we will be editing it
     * we find the book by its ID and then we update it, f we cant find the book
     * we throw an exception, as each edited book must to have an ID to be able to update it.
     * 
     * @param id The ID of the book to update
     * @param title The updated title of the book
     * @param authorName The updated author name
     * @param publishedDate The updated published date
     * @return The updated Book object
     */
    public Book updateBook(Long id, String title, String authorName, String publishedDate) {
        try 
        {
            // we try to find the book first
            Book bookToUpdate = findById(id);

            // checking if the book exist
            if(bookToUpdate == null) {
                throw new IllegalArgumentException("Book not found");
            }

            // we get the date and author object with the updated data
            LocalDate date = parsePublishedDate(publishedDate);
            Author author = getOrCreateAuthor(authorName);

            // updating the book data
            bookToUpdate.setTitle(title);
            bookToUpdate.setAuthor(author);
            bookToUpdate.setPublishedDate(date);

            return bookRepository.save(bookToUpdate);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format", e);
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while updating book", e);
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

            // if we cant find the book to delete, we throw an exception
            if(bookToDelete == null) {
                throw new IllegalArgumentException("Book not found");
            }

            // doing the deletion itself
            bookRepository.delete(bookToDelete);

            return bookToDelete;
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while deleting book", e);
        }
    }

    /**
     * This method will be the filtering of the book data by the published date
     * it will be receiving a string of the date and it will be returning a list of books
     * that match with that published date, if the date format is invalid it will throw an exception.
     * @param publishedDate The published date as a string to filter the books
     * @return A list of books that match with the published date, or an empty list if no books are found.
     */
    public List<Book> findByPublishedDate(String publishedDate) {
        try 
        {    
            // getting the LocalDate from the string publishedDate
            LocalDate date = parsePublishedDate(publishedDate);

            // loading the books with the published date from the database
            List<Book> books = bookRepository.findByPublishedDate(date);
        
            // validating if we dont have any book with that published date
            if (books == null || books.isEmpty()) {
                return List.of();
            }
        
            return books;

        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format", e);
        } catch (DataAccessException e) {
            throw new RuntimeException("Database error while retrieving books by published date", e);
        }

    }

    
}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                