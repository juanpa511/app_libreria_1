package com.tallerjj.apirest.config;

import com.tallerjj.apirest.security.JwtAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {



    @Autowired
    private JwtAuthorizationFilter jwtAuthorizationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // DaoAuthenticationProvider eliminado para evitar warning de deprecación
    // Spring Security 6 maneja automáticamente la autenticación con UserDetailsService

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/auth/register", "/auth/login").permitAll()
                .requestMatchers("/book/all/**").permitAll()
                .requestMatchers("/test/**").permitAll()
                
                // Endpoints de ADMIN
                .requestMatchers("/book/new", "/book/find/**", "/book/newcopy", "/book/copy/**").hasRole("ADMIN")
                .requestMatchers("/booking/new", "/booking/return/**").hasRole("ADMIN")
                .requestMatchers("/reader/find/**", "/reader/state/**").hasRole("ADMIN")
                .requestMatchers("/fine/find/**").hasRole("ADMIN")
                
                // Endpoints de LECTOR
                .requestMatchers("/booking/find/**").hasAnyRole("ADMIN", "LECTOR")
                .requestMatchers("/fine/find/**").hasAnyRole("ADMIN", "LECTOR")
                
                // Permitir todas las demás peticiones temporalmente para pruebas
                .anyRequest().permitAll()
            )
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
} 