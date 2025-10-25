DO $$
DECLARE
    uid INT;
    admin_id INT;
    role_user_id INT;
    role_super_admin_id INT;
    role_admin_id INT;
    cinema_id INT;
BEGIN
    INSERT INTO roles(name) VALUES ('USER') RETURNING id INTO role_user_id;
    INSERT INTO roles(name) VALUES ('SUPER_ADMIN') RETURNING id INTO role_super_admin_id;
    INSERT INTO roles(name) VALUES ('ADMIN') RETURNING id INTO role_admin_id;

    -- Tạo user
    INSERT INTO users (email, password, is_verified, o_auth2_provider)
    VALUES ('prx@prx.com', '$2a$10$PwD282xnLj5lUl/GD33m6..kk6CwaBsxtJJhwOnKPfHuKwC13Vqoi', true, 'NONE')
    RETURNING id INTO uid;

    -- Gán roles
    INSERT INTO user_role(user_id, role_id)
    VALUES (uid, role_user_id), (uid, role_super_admin_id);

    -- Thêm vào user_admin
    INSERT INTO user_admin(user_id)
    VALUES (uid);

    --------------------------------------------------------------------------------------------------------------------

    INSERT INTO cinemas(name, street, province)
    VALUES ('CineHome 1', 'Street 1', 'Province 1')
    RETURNING id INTO cinema_id;

    INSERT INTO users (email, password, is_verified, o_auth2_provider)
    VALUES ('admin1', '$2a$10$.VxZPIWe34LDSfaljLeYYe4vLJLAGY6/0ERfaP.Xbd2ds4HYh6y2y', true, 'NONE')
    RETURNING id INTO admin_id;

    INSERT INTO user_role(user_id, role_id)
    VALUES (admin_id, role_admin_id);

    INSERT INTO user_admin(user_id, cinema_id)
    VALUES (admin_id, cinema_id);

    INSERT INTO screens(name, cinema_id)
    VALUES
        ('SCREEN 01', cinema_id),
        ('SCREEN 02', cinema_id),
        ('SCREEN 03', cinema_id),
        ('SCREEN 04', cinema_id),
        ('SCREEN 05', cinema_id),
        ('SCREEN 06', cinema_id);
END $$;


INSERT INTO cinemas(name, street, province) VALUES ('CineHome 2', 'Street 2', 'Province 2');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 3', 'Street 3', 'Province 3');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 4', 'Street 4', 'Province 4');
INSERT INTO cinemas(name, street, province) VALUES ('CineHome 5', 'Street 5', 'Province 5');

INSERT INTO users(email, password, is_verified, o_auth2_provider)
VALUES ('user1', '$2a$10$dH2wpbCXhNjMPZRsqtSNHOdkF3bWFFDEt5cUgdXNymVoQ.7ipFZIe', true, 'NONE');
