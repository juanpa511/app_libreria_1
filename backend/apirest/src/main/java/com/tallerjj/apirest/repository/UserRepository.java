package com.tallerjj.apirest.repository;

import com.tallerjj.apirest.entity.User;
import com.tallerjj.apirest.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    /**
     * Busca un usuario por su email
     * @param email el email del usuario
     * @return Optional con el usuario si existe
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Verifica si existe un usuario con el email especificado
     * @param email el email a verificar
     * @return true si existe, false en caso contrario
     */
    boolean existsByEmail(String email);
    
    /**
     * Busca usuarios por estado
     * @param state el estado del usuario (activo/inactivo)
     * @return lista de usuarios con el estado especificado
     */
    List<User> findByState(boolean state);

    @Query("SELECT DISTINCT u FROM User u JOIN FETCH u.roles r WHERE u.email = :email")
    Optional<User> findByEmailWithRoles(@Param("email") String email);
    
    @Query(value = "SELECT u.email, u.name, u.last_name, r.name as role_name, ur.user_fk, ur.rol_fk " +
                   "FROM user u " +
                   "LEFT JOIN user_rol ur ON u.email = ur.user_fk " +
                   "LEFT JOIN rol r ON ur.rol_fk = r.id_rol " +
                   "WHERE u.email = :email", nativeQuery = true)
    List<Object[]> findUserWithRolesDebug(@Param("email") String email);

    @Query(value = "SELECT r.* FROM user_rol ur JOIN rol r ON ur.rol_fk = r.id_rol WHERE ur.user_fk = :email", nativeQuery = true)
    List<Rol> findRolesByUserEmail(@Param("email") String email);
} 