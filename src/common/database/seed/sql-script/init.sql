DO $$
    DECLARE
        role_user_id INT;
        role_super_admin_id INT;
        role_admin_id INT;

        super_admin_id INT;
        cinema1_id INT;
        cinema2_id INT;
        admin1_id INT;
        admin2_id INT;

        -- seat_types
        seat_type_single_id   INTEGER;
        seat_type_couple_id   INTEGER;

        -- formats
        format_2d_id          INTEGER;
        format_3d_id          INTEGER;
        format_imax_id        INTEGER;

        -- audiences
        audience_adult_id     INTEGER;
        audience_kid_id       INTEGER;
        audience_student_id   INTEGER;

        -- day_types
        day_type_weekday_id   INTEGER;
        day_type_weekend_id   INTEGER;

        -- time_slots
        time_slot_morning_id   INTEGER;
        time_slot_afternoon_id INTEGER;
        time_slot_evening_id   INTEGER;
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
        VALUES
            ('SCREEN01', cinema1_id),
            ('SCREEN02', cinema1_id),
            ('SCREEN03', cinema1_id),
            ('SCREEN04', cinema1_id),
            ('SCREEN05', cinema1_id),
            ('SCREEN06', cinema1_id);

        -- insert screens for cinema has id `cinema2_id`
        INSERT INTO screens (name, cinema_id)
        VALUES
            ('SCREEN01', cinema2_id),
            ('SCREEN02', cinema2_id),
            ('SCREEN03', cinema2_id),
            ('SCREEN04', cinema2_id),
            ('SCREEN05', cinema2_id);

        -- insert seat_types
        INSERT INTO seat_types (code, description)
        VALUES ('SINGLE', '')
        RETURNING id INTO seat_type_single_id;

        INSERT INTO seat_types (code, description)
        VALUES ('COUPLE', '')
        RETURNING id INTO seat_type_couple_id;

        -- insert formats
        INSERT INTO formats (code, description)
        VALUES ('2D', '')
        RETURNING id INTO format_2d_id;

        INSERT INTO formats (code, description)
        VALUES ('3D', '')
        RETURNING id INTO format_3d_id;

        INSERT INTO formats (code, description)
        VALUES ('IMAX', '')
        RETURNING id INTO format_imax_id;

        -- insert audiences
        INSERT INTO audiences (type, description)
        VALUES ('ADULT', '')
        RETURNING id INTO audience_adult_id;

        INSERT INTO audiences (type, description)
        VALUES ('KID', '')
        RETURNING id INTO audience_kid_id;

        INSERT INTO audiences (type, description)
        VALUES ('STUDENT', '')
        RETURNING id INTO audience_student_id;

        -- insert day_types
        INSERT INTO day_types (code, description)
        VALUES ('WEEKDAY', '')
        RETURNING id INTO day_type_weekday_id;

        INSERT INTO day_types (code, description)
        VALUES ('WEEKEND', '')
        RETURNING id INTO day_type_weekend_id;

        -- insert time_slots
        INSERT INTO time_slots (code, description, start_time, end_time)
        VALUES ('MORNING', '', '07:00:00', '11:00:00')
        RETURNING id INTO time_slot_morning_id;

        INSERT INTO time_slots (code, description, start_time, end_time)
        VALUES ('AFTERNOON', '', '11:00:00', '17:00:00')
        RETURNING id INTO time_slot_afternoon_id;

        INSERT INTO time_slots (code, description, start_time, end_time)
        VALUES ('EVENING', '', '17:00:00', '23:00:00')
        RETURNING id INTO time_slot_evening_id;

        --
        INSERT INTO audience_surcharge (cinema_id, audience_id, surcharge)
        VALUES
            (cinema1_id, audience_adult_id,   -1),   -- người lớn không phụ thu
            (cinema1_id, audience_kid_id,     -1), -- trẻ em giảm giá 20k
            (cinema1_id, audience_student_id, -1); -- sinh viên giảm 10k

        INSERT INTO day_type_surcharge (cinema_id, day_type_id, surcharge)
        VALUES
            (cinema1_id, day_type_weekday_id, 0),       -- ngày thường: không phụ thu
            (cinema1_id, day_type_weekend_id, 0);   -- cuối tuần: phụ thu 15k

        INSERT INTO format_surcharge (cinema_id, format_id, surcharge)
        VALUES
            (cinema1_id, format_2d_id, 0),        -- 2D: không phụ thu
            (cinema1_id, format_3d_id, 0),    -- 3D: phụ thu 20k
            (cinema1_id, format_imax_id, 0);  -- IMAX: phụ thu 50k

        INSERT INTO seat_type_surcharge (cinema_id, seat_type_id, surcharge)
        VALUES
            (cinema1_id, seat_type_single_id, 0),      -- ghế đơn: không phụ thu
            (cinema1_id, seat_type_couple_id, 0);  -- ghế đôi: phụ thu 40k

        INSERT INTO time_slot_surcharge (cinema_id, time_slot_id, surcharge)
        VALUES
            (cinema1_id, time_slot_morning_id, 0),
            (cinema1_id, time_slot_afternoon_id, 0),
            (cinema1_id, time_slot_evening_id, 0);

        --
        INSERT INTO genres (name)
        VALUES
            ('Kinh dị'),
            ('Hành động'),
            ('Lãng mạn');
    END;
$$;
