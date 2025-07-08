package com.tallerjj.apirest.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

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
    
    @GetMapping("/auth-info")
    public Map<String, Object> getAuthInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> info = new HashMap<>();
        
        if (authentication != null && authentication.isAuthenticated()) {
            info.put("authenticated", true);
            info.put("username", authentication.getName());
            info.put("authorities", authentication.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toList()));
            info.put("isAdmin", authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));
            info.put("isLector", authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_LECTOR")));
        } else {
            info.put("authenticated", false);
        }
        
        return info;
    }
    
    @GetMapping("/admin-only")
    public String adminOnly() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        
        if (isAdmin) {
            return "Acceso permitido - Eres ADMIN";
        } else {
            return "Acceso denegado - No eres ADMIN";
        }
    }
    
    @GetMapping("/lector-only")
    public String lectorOnly() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isLector = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_LECTOR"));
        
        if (isLector) {
            return "Acceso permitido - Eres LECTOR";
        } else {
            return "Acceso denegado - No eres LECTOR";
        }
    }
} 