DO
$$
    DECLARE
        role_user_id        INT;
        role_super_admin_id INT;
        role_admin_id       INT;
        super_admin_id      INT;
        cinema1_id          INT;
        cinema2_id          INT;
        admin1_id           INT;
        admin2_id           INT;
    BEGIN
        -- insert user
        INSERT INTO users(email, password, is_verified, o_auth2_provider)
        VALUES ('user1', '$2a$10$dH2wpbCXhNjMPZRsqtSNHOdkF3bWFFDEt5cUgdXNymVoQ.7ipFZIe', true, 'NONE');

        -- insert role: user, admin, super_admin
        INSERT INTO roles(name) VALUES ('USER') RETURNING id INTO role_user_id;
        INSERT INTO roles(name) VALUES ('SUPER_ADMIN') RETURNING id INTO role_super_admin_id;
        INSERT INTO roles(name) VALUES ('ADMIN') RETURNING id INTO role_admin_id;

        -- insert super_admin
        INSERT INTO users (email, password, is_verified, o_auth2_provider)
        VALUES ('superadmin', '$2a$10$MDU/JxUaimkesKwN4OhNSe5ZF/jeUxX8i4h8LnFfN0IWHuEe/JrtO', true, 'NONE')
        RETURNING id INTO super_admin_id;

        INSERT INTO user_role(user_id, role_id)
        VALUES (super_admin_id, role_super_admin_id);

        INSERT INTO user_admin(user_id, cinema_id)
        VALUES (super_admin_id, null);

        -- insert cinemas
        INSERT INTO cinemas (name, street, province)
        VALUES ('cinema1', 'street1', 'province1')
        RETURNING id INTO cinema1_id;


        INSERT INTO cinemas (name, street, province)
        VALUES ('cinema2', 'street2', 'province2')
        RETURNING id INTO cinema2_id;


        INSERT INTO cinemas (name, street, province)
        VALUES ('cinema3', 'street3', 'province3');


        INSERT INTO cinemas (name, street, province)
        VALUES ('cinema4', 'street4', 'province4');


        INSERT INTO cinemas (name, street, province)
        VALUES ('cinema5', 'street5', 'province5');

        -- insert admin1 for cinema `cinema1_id`
        INSERT INTO users (email, password, is_verified, o_auth2_provider)
        VALUES ('admin1', '$2a$10$w6O/YXftW0jlYe8FAhl87O1hkQTt/k4YdFapKKLuQW7RrHawXLV/i', true, 'NONE')
        RETURNING id INTO admin1_id;

        INSERT INTO user_role (user_id, role_id)
        VALUES (admin1_id, role_admin_id);

        INSERT INTO user_admin (user_id, cinema_id)
        VALUES (admin1_id, cinema1_id);

        -- insert admin2 for cinema `cinema2_id`
        INSERT INTO users (email, password, is_verified, o_auth2_provider)
        VALUES ('admin2', '$2a$10$13Tr9qF1Yo72JxbPNSFTveiFq7TH23JZBDbqRVR5mWi7PtYVMhhwe', true, 'NONE')
        RETURNING id INTO admin2_id;

        INSERT INTO user_role (user_id, role_id)
        VALUES (admin2_id, role_admin_id);

        INSERT INTO user_admin (user_id, cinema_id)
        VALUES (admin2_id, cinema2_id);

        -- insert screens for cinema has id `cinema1_id`
        INSERT INTO screens (name, cinema_id)
        VALUES ('SCREEN01', cinema1_id),
               ('SCREEN02', cinema1_id),
               ('SCREEN03', cinema1_id),
               ('SCREEN04', cinema1_id),
               ('SCREEN05', cinema1_id),
               ('SCREEN06', cinema1_id);

        -- insert screens for cinema has id `cinema2_id`
        INSERT INTO screens (name, cinema_id)
        VALUES ('SCREEN01', cinema2_id),
               ('SCREEN02', cinema2_id),
               ('SCREEN03', cinema2_id),
               ('SCREEN04', cinema2_id),
               ('SCREEN05', cinema2_id);

        -- insert seat_types
        INSERT INTO seat_types (code, description)
        VALUES ('SINGLE', '');

        INSERT INTO seat_types (code, description)
        VALUES ('COUPLE', '');


        -- insert formats
        INSERT INTO formats (code, description)
        VALUES ('2D', '');

        INSERT INTO formats (code, description)
        VALUES ('3D', '');

        INSERT INTO formats (code, description)
        VALUES ('IMAX', '');

        -- insert audiences
        INSERT INTO audiences (type, description)
        VALUES ('ADULT', '');

        INSERT INTO audiences (type, description)
        VALUES ('CHILD', '');

        INSERT INTO audiences (type, description)
        VALUES ('STUDENT', '');

        -- insert day_types
        INSERT INTO day_types (code, description)
        VALUES ('WEEKDAY', '');

        INSERT INTO day_types (code, description)
        VALUES ('WEEKEND', '');

        -- insert time_slots
        INSERT INTO time_slots (code, description, start_time, end_time)
        VALUES ('MORNING', '', '07:00:00', '11:00:00');

        INSERT INTO time_slots (code, description, start_time, end_time)
        VALUES ('AFTERNOON', '', '11:00:00', '17:00:00');

        INSERT INTO time_slots (code, description, start_time, end_time)
        VALUES ('EVENING', '', '17:00:00', '23:00:00');

    END;
$$;
