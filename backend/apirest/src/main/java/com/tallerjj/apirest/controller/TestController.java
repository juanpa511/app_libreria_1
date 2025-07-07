package com.tallerjj.apirest.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "¡Hola! TestController funcionando correctamente";
    }

    @GetMapping("/status")
    public String status() {
        return "Aplicación funcionando correctamente";
    }
} 