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
