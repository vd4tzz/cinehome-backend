WITH inserted_role AS (
INSERT
INTO roles(name)
VALUES ('USER')
    RETURNING id
    ), inserted_user AS (
INSERT
INTO users(email, password, is_verified, o_auth2_provider)
VALUES ('prx@prx.com', '$2a$10$PwD282xnLj5lUl/GD33m6..kk6CwaBsxtJJhwOnKPfHuKwC13Vqoi', true, 'NONE')
    RETURNING id
    )
-- Dùng id vừa insert để insert vào bảng liên kết
INSERT
INTO user_role(user_id, role_id)
SELECT inserted_user.id, inserted_role.id
FROM inserted_user,
     inserted_role;

INSERT INTO cinemas(name, street, province) values ('CineHome 1', 'Street 1', 'Province 1');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 2', 'Street 2', 'Province 2');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 3', 'Street 3', 'Province 3');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 4', 'Street 4', 'Province 4');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 5', 'Street 5', 'Province 5');
