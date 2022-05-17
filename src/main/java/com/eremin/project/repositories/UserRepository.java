package com.eremin.project.repositories;

import com.eremin.project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("select u from User u join fetch u.roles where u.id = :id")
    User findUserById(Long id);

    @Query("select u from User u join fetch u.roles where u.email = :email")
    User findUserByEmail(String email);

    @Query("from User u join fetch u.roles")
    List<User> findAll();
}
