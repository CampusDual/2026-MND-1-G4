package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Migra datos semilla para dejar un usuario administrador inicial.
 */
public class V2__SeedAdminUser extends BaseJavaMigration {

    @Override
    public void migrate(Context context) throws Exception {
        Connection connection = context.getConnection();

        Long roleId = findRoleId(connection, "ROLE_ADMIN");
        if (roleId == null) {
            roleId = insertRole(connection, "ROLE_ADMIN");
        }

        Long userId = findUserId(connection, "admin");
        if (userId == null) {
            userId = insertAdminUser(connection);
        }

        if (!existsUserRole(connection, userId, roleId)) {
            insertUserRole(connection, userId, roleId);
        }
    }

    private Long findRoleId(Connection connection, String roleName) throws SQLException {
        String sql = "SELECT id FROM roles WHERE name = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, roleName);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getLong("id");
                }
                return null;
            }
        }
    }

    private Long insertRole(Connection connection, String roleName) throws SQLException {
        String sql = "INSERT INTO roles (name) VALUES (?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, roleName);
            statement.executeUpdate();
        }
        return findRoleId(connection, roleName);
    }

    private Long findUserId(Connection connection, String username) throws SQLException {
        String sql = "SELECT id FROM users WHERE username = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, username);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getLong("id");
                }
                return null;
            }
        }
    }

    private Long insertAdminUser(Connection connection) throws SQLException {
        String sql = "INSERT INTO users (username, password, enabled) VALUES (?, ?, ?)";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, "admin");
            statement.setString(2, encoder.encode("admin1234"));
            statement.setBoolean(3, true);
            statement.executeUpdate();
        }

        return findUserId(connection, "admin");
    }

    private boolean existsUserRole(Connection connection, Long userId, Long roleId) throws SQLException {
        String sql = "SELECT COUNT(1) AS total FROM user_roles WHERE user_id = ? AND role_id = ?";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            statement.setLong(2, roleId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return resultSet.getInt("total") > 0;
                }
                return false;
            }
        }
    }

    private void insertUserRole(Connection connection, Long userId, Long roleId) throws SQLException {
        String sql = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)";
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, userId);
            statement.setLong(2, roleId);
            statement.executeUpdate();
        }
    }
}

