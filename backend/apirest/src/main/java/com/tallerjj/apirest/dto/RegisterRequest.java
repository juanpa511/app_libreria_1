package com.tallerjj.apirest.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String name;
    private String lastName;
    private String password;
} 