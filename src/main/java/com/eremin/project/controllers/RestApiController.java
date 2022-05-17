package com.eremin.project.controllers;

import com.eremin.project.entities.User;
import com.eremin.project.exceptions.InvalidUserException;
import com.eremin.project.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class RestApiController {


    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    //Получение пользователя по ID
    @GetMapping("/users/{id}")
    public ResponseEntity<User> showUserById(@PathVariable Long id) {
        if (userService.getUserById(id) == null) {
            throw new InvalidUserException("Пользователь с ID = " + id + " не найден");
        }
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }


    //Получение всех пользователей
    @GetMapping("/users")
    public ResponseEntity<Set<User>> showAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }


    //Получение текущего пользователя
    @GetMapping("/principal")
    public ResponseEntity<User> showPrincipal(Principal principal) {
        return new ResponseEntity<>(userService.getUserByEmail(principal.getName()), HttpStatus.OK);
    }


    //Добавление нового пользователя
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.getUserByEmail(user.getEmail()) != null) {
            throw new InvalidUserException("Пользователь уже существует");
        }
        User protectedUser = userService.passwordEncoder(user);
        userService.saveUser(protectedUser);
        return new ResponseEntity<>(protectedUser, HttpStatus.CREATED);
    }


    //Изменение пользователя
    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.getUserById(id) == null) {
            throw new InvalidUserException("Пользователь с ID = " + id + " не найден");
        }
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}