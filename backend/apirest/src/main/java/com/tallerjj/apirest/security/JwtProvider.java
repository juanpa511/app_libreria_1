package com.tallerjj.apirest.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.secret:defaultSecretKey123456789012345678901234567890}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        // Asegurar que la clave tenga al menos 512 bits (64 bytes) para HS512
        byte[] keyBytes = jwtSecret.getBytes();
        if (keyBytes.length < 64) {
            // Si la clave es muy corta, la extendemos
            byte[] extendedKey = new byte[64];
            System.arraycopy(keyBytes, 0, extendedKey, 0, Math.min(keyBytes.length, 64));
            return Keys.hmacShaKeyFor(extendedKey);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Genera un token JWT a partir del email del usuario
     * @param email el email del usuario
     * @return el token JWT generado
     */
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Genera un token JWT con versión de usuario para invalidación
     * @param email el email del usuario
     * @param userVersion la versión del usuario (timestamp de última modificación)
     * @return el token JWT generado
     */
    public String generateToken(String email, Long userVersion) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .claim("userVersion", userVersion)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Extrae el email del usuario desde el token JWT
     * @param token el token JWT
     * @return el email del usuario
     */
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /**
     * Extrae la versión del usuario desde el token JWT
     * @param token el token JWT
     * @return la versión del usuario o null si no existe
     */
    public Long getUserVersionFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("userVersion", Long.class);
    }

    /**
     * Valida si el token JWT es válido
     * @param token el token JWT a validar
     * @return true si el token es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Valida si el token JWT es válido y no ha sido invalidado por cambios de usuario
     * @param token el token JWT a validar
     * @param currentUserVersion la versión actual del usuario en la BD
     * @return true si el token es válido y actualizado, false en caso contrario
     */
    public boolean validateToken(String token, Long currentUserVersion) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Long tokenUserVersion = claims.get("userVersion", Long.class);
            
            // Si no hay versión en el token, considerarlo válido (backward compatibility)
            if (tokenUserVersion == null) {
                return true;
            }

            // Si la versión del token es menor que la actual, el token está invalidado
            return tokenUserVersion >= currentUserVersion;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extrae el token del header Authorization
     * @param authorizationHeader el header Authorization completo
     * @return el token sin el prefijo "Bearer "
     */
    public String extractTokenFromHeader(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
} 