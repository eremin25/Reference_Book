package com.eremin.project.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageHomeController {

    @GetMapping("/pageHome")
    public String pageHome() {
        return "/pageHome";
    }
}
