package com.eremin.project.services;

import com.eremin.project.entities.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Set;

public interface UserService extends UserDetailsService {

    User getUserById(Long id);

    Set<User> getAllUsers();

    User getUserByEmail(String email);

    User passwordEncoder(User user);

    void saveUser(User user);

    void updateUser(User user);

    void deleteUser(Long id);
}
