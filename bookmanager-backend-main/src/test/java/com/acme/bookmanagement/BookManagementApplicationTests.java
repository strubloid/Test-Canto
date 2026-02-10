package com.acme.bookmanagement;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.acme.bookmanagement.service.BookService;

/**
 * This test is to make sure we can boot the application, the reason of @springBootTest is to load the full application context, 
 * this will help us to check if all the beans are loaded correctly and if there are any issues with the configuration.
 */
@SpringBootTest
class BookManagementApplicationTests {

    @Autowired
    private BookService bookService;

    @Test
    void contextLoads() {
    }

    /**
     * This test will check if the bookService bean is loaded
     */
    @Test
    void bookServiceBeanLoads() {
        org.junit.jupiter.api.Assertions.assertNotNull(bookService);
    }

}
