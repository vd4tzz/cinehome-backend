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
--         INSERT INTO genres (name)
--         VALUES ('Phim Hành Động'),
--                ('Phim Phiêu Lưu'),
--                ('Phim Hoạt Hình'),
--                ('Phim Hài'),
--                ('Phim Hình Sự'),
--                ('Phim Tài Liệu'),
--                ('Phim Chính Kịch'),
--                ('Phim Gia Đình'),
--                ('Phim Giả Tượng'),
--                ('Phim Lịch Sử'),
--                ('Phim Kinh Dị'),
--                ('Phim Nhạc'),
--                ('Phim Bí Ẩn'),
--                ('Phim Lãng Mạn'),
--                ('Phim Khoa Học Viễn Tưởng'),
--                ('Chương Trình Truyền Hình'),
--                ('Phim Gây Cấn'),
--                ('Phim Chiến Tranh'),
--                ('Phim Miền Tây');

        INSERT INTO genres (id, name)
        VALUES (28, 'Phim Hành Động'),
               (12, 'Phim Phiêu Lưu'),
               (16, 'Phim Hoạt Hình'),
               (35, 'Phim Hài'),
               (80, 'Phim Hình Sự'),
               (99, 'Phim Tài Liệu'),
               (18, 'Phim Chính Kịch'),
               (10751, 'Phim Gia Đình'),
               (14, 'Phim Giả Tượng'),
               (36, 'Phim Lịch Sử'),
               (27, 'Phim Kinh Dị'),
               (10402, 'Phim Nhạc'),
               (9648, 'Phim Bí Ẩn'),
               (10749, 'Phim Lãng Mạn'),
               (878, 'Phim Khoa Học Viễn Tưởng'),
               (10770, 'Chương Trình Truyền Hình'),
               (53, 'Phim Gây Cấn'),
               (10752, 'Phim Chiến Tranh'),
               (37, 'Phim Miền Tây');
        ---


--         INSERT INTO movies (vietnamese_title, original_title, release_date, overview, poster_url, backdrop_url,
--                             duration, age_rating, director, state, actors)
--         VALUES ('Thành Phố Động Vật: Phi Vụ Động Trời 2', 'Zootopia 2', '2025-11-28', '',
--                 'https://image.tmdb.org/t/p/original/5wXpOF9WPUKliIzNBdAqwAStLHU.jpg',
--                 'https://image.tmdb.org/t/p/original/7nfpkR9XsQ1lBNCXSSHxGV7Dkxe.jpg', 100, NULL, 'Jared Bush',
--                 'PUBLISHED', '[
--             "Ginnifer Goodwin",
--             "Jason Bateman",
--             "Quan Kế Huy",
--             "Idris Elba",
--             "Fortune Feimster"
--           ]'),
--                ('Wicked: Phần 2', 'Wicked: For Good', '2025-11-21', '',
--                 'https://image.tmdb.org/t/p/original/oQSPp51Uv74civ9gv3wqJmqlJVX.jpg',
--                 'https://image.tmdb.org/t/p/original/l8pwO23MCvqYumzozpxynCNfck1.jpg', 100, NULL, 'Jon M. Chu',
--                 'PUBLISHED', '[
--                  "Cynthia Erivo",
--                  "Ariana Grande",
--                  "Jonathan Bailey",
--                  "Dương Tử Quỳnh",
--                  "Jeff Goldblum"
--                ]'),
--                ('Trốn Chạy Tử Thần', 'The Running Man', '2025-11-14', '',
--                 'https://image.tmdb.org/t/p/original/lSUUBWX1vp4WkjTUkd2mbRUuwt8.jpg',
--                 'https://image.tmdb.org/t/p/original/jFhdb45moOI78fkvtRNybjs1H4h.jpg', 100, NULL, 'Edgar Wright',
--                 'PUBLISHED', '[
--                  "Glen Powell",
--                  "Josh Brolin",
--                  "Michael Cera",
--                  "Colman Domingo",
--                  "Lee Pace"
--                ]'),
--                ('Già Gân Báo Thù 2', 'Sisu 2', '2025-11-28', '',
--                 'https://image.tmdb.org/t/p/original/itWues3GbmReREgtuPNEACvL628.jpg',
--                 'https://image.tmdb.org/t/p/original/aYwd43E8aq2fQiak0SU8dbCjyZ5.jpg', 100, NULL, 'Jalmari Helander',
--                 'PUBLISHED', '[
--                  "Jorma Tommila",
--                  "Richard Brake",
--                  "Stephen Lang",
--                  "Einar Haraldsson",
--                  "Jaakko Hutchings"
--                ]'),
--                ('Thám Tử Lừng Danh Conan: Dư Ảnh Của Độc Nhãn', '名探偵コナン 隻眼の残像（フラッシュバック）',
--                 '2025-07-25',
--                 'Thám Tử Lừng Danh Conan 28: Dư Ảnh Của Độc Nhãn – Trên những ngọn núi tuyết của Nagano, một vụ án bí ẩn đã đưa Conan và các thám tử quay trở lại quá khứ. Thanh tra Yamato Kansuke - người đã bị thương nặng trong một trận tuyết lở nhiều năm trước - bất ngờ phải đối mặt với những ký ức đau thương của mình trong khi điều tra một vụ tấn công tại Đài quan sát Nobeyama. Cùng lúc đó, Mori Kogoro nhận được một cuộc gọi từ một đồng nghiệp cũ, tiết lộ mối liên hệ đáng ngờ giữa anh ta và vụ án đã bị lãng quên từ lâu. Sự xuất hiện của Morofushi Takaaki, cùng với những nhân vật chủ chốt như Amuro Tooru, Kazami và cảnh sát Tokyo, càng làm phức tạp thêm cuộc điều tra. Khi quá khứ và hiện tại đan xen, một bí ẩn rùng rợn dần dần được hé lộ - và ký ức của Kansuke nắm giữ chìa khóa cho mọi thứ.',
--                 'https://image.tmdb.org/t/p/original/8iuOKfhsRUoOLuufXWyK89HpIPC.jpg',
--                 'https://image.tmdb.org/t/p/original/bE10DMcePbEWa8LAWZQ16vQNrwT.jpg', 100, NULL, '重原克也',
--                 'PUBLISHED', '[
--                  "高山みなみ",
--                  "山口勝平",
--                  "山崎和佳奈",
--                  "小山力也",
--                  "高田裕司"
--                ]'),
--                ('Chân Dung Cô Gái Trên Ngọn Lửa', 'Portrait de la jeune fille en feu', '2025-11-23',
--                 'Trên một hòn đảo biệt lập ở Brittany vào cuối thế kỷ XVIII, một nữ họa sĩ có nghĩa vụ vẽ một bức chân dung đám cưới của một phụ nữ trẻ.',
--                 'https://image.tmdb.org/t/p/original/lH2hSK6F1FZmS3ao384kZCMsbCl.jpg',
--                 'https://image.tmdb.org/t/p/original/foFq1RZWQIgFuCQ0nyYccywjFyX.jpg', 100, NULL, 'Céline Sciamma',
--                 'PUBLISHED', '[
--                  "Noémie Merlant",
--                  "Adèle Haenel",
--                  "Luàna Bajrami",
--                  "Valeria Golino",
--                  "Christel Baras"
--                ]'),
--                ('Kỳ An Nghỉ', 'Keeper', '2025-11-21',
--                 'Liz và Malcolm trốn khỏi thành phố để tận hưởng kỳ nghỉ kỷ niệm tại một căn cabin hẻo lánh. Nhưng khi Malcolm đột ngột quay về, Liz bị bỏ lại một mình — và dần nhận ra mình đang đối mặt với một thế lực tà ác khó gọi tên, kẻ đang canh giữ những bí mật kinh hoàng của nơi này.',
--                 'https://image.tmdb.org/t/p/original/iq0Es2hGY08EHbNXCX9pXYu6VFq.jpg',
--                 'https://image.tmdb.org/t/p/original/5sulGeqGyXj9EvYg8IjxEWFIRdM.jpg', 100, NULL, 'Osgood Perkins',
--                 'PUBLISHED', '[
--                  "Tatiana Maslany",
--                  "Rossif Sutherland",
--                  "Birkett Turton",
--                  "Eden Weiss",
--                  "Logan Pierce"
--                ]'),
--                ('Quán Kỳ Nam', 'Quán Kỳ Nam', '2025-11-28',
--                 'Với sự nâng đỡ của người chú quyền lực, Khang được giao cho công việc dịch cuốn “Hoàng Tử Bé” và dọn vào căn hộ bỏ trống ở khu chung cư cũ. Anh làm quen với cô hàng xóm tên Kỳ Nam, một góa phụ từng nổi danh trong giới nữ công gia chánh và giờ lặng lẽ với nghề nấu cơm tháng. Một tai nạn xảy ra khiến Kỳ Nam không thể tiếp tục công việc của mình. Khang đề nghị giúp đỡ và mối quan hệ của họ dần trở nên sâu sắc, gắn bó. Liệu mối quan hệ của họ có thể tồn tại lâu dài giữa những biến động củа xã hội thời bấy giờ?',
--                 'https://image.tmdb.org/t/p/original/yNdB4HKfOXPaQLzUlRq81DbTKnh.jpg',
--                 'https://image.tmdb.org/t/p/original/zyZE8dLaJg6o4jDmoNdPctlmaHb.jpg', 100, NULL, 'Leon Le',
--                 'PUBLISHED', '[
--                  "Liên Bỉnh Phát",
--                  "Do Thi Hai Yen",
--                  "Phương Bình",
--                  "Lý Kiều Hạnh",
--                  "Trần Thế Mạnh"
--                ]'),
--                ('Truy Tìm Long Diên Hương', 'Truy Tìm Long Diên Hương', '2025-11-12',
--                 'Một hành trình tìm lại bảo vật Long Diên Hương siêu quậy và siêu lầy lội đang chờ bạn ở phía trước.  Quang Tuấn, Ma Ran Đô, Nguyên Thảo, Hoàng Tóc Dài, Doãn Quốc Đam,... đã sẵn sàng lên đường Truy Tìm Long Diên Hương.',
--                 'https://image.tmdb.org/t/p/original/7fHlcEovyJY1YhTd8FaJXj1mUk8.jpg',
--                 'https://image.tmdb.org/t/p/original/ociHIRRo2HNgRG2et4nDyNyTrM5.jpg', 100, NULL, 'Dương Minh Chiến',
--                 'PUBLISHED', '[
--                  "Ngô Quang Tuấn",
--                  "Ma Ran Đô",
--                  "Nguyên Thảo",
--                  "Thanh Nam",
--                  "Hoàng Tóc Dài"
--                ]'),
--                ('Bẫy Tiền', 'Bẫy Tiền', '2025-11-21', '',
--                 'https://image.tmdb.org/t/p/original/ayDNI6x8g3638uQSTmNqW9CeUUU.jpg',
--                 'https://image.tmdb.org/t/p/originalnull', 100, NULL, 'Oscar Duong', 'PUBLISHED', '[
--                  "Liên Bỉnh Phát",
--                  "Tam Triều Dâng",
--                  "Mai Cat Vi"
--                ]'),
--                ('Phòng Trọ Ma Bầu', 'Phòng Trọ Ma Bầu', '2025-11-28', '',
--                 'https://image.tmdb.org/t/p/original/wBmi0b5dOh42r1QCGUlfjxvFM2V.jpg',
--                 'https://image.tmdb.org/t/p/originalnull', 100, NULL, 'Nguy Minh Khang', 'PUBLISHED', '[
--                  "Huỳnh Phương",
--                  "Phương Lan",
--                  "Cát Phượng",
--                  "Lý Hùng",
--                  "Kim Tuyến"
--                ]'),
--                                                                                                                                                                    ('Cưới Vợ Cho Cha', 'Cưới Vợ Cho Cha', '2025-11-21', '', 'https://image.tmdb.org/t/p/original/29ZwzvtIyi1k3UB7cbqWoWyo5va.jpg', 'https://image.tmdb.org/t/p/originalnull', 100, NULL, 'Nguyen Ngoc Lâm', 'PUBLISHED', '["Trương Minh Thảo","Hữu Châu","Hồng Vân","Thuý Diễm","Kim Hải"]');


-- Insert movies
        INSERT INTO movies (original_title, vietnamese_title, overview, release_date, duration,
                            poster_url, backdrop_url, director, actors)
        VALUES ('Black Phone 2', 'Điện Thoại Đen 2',
                'Bốn năm trước, Finn khi mới 13 tuổi đã giết chết kẻ bắt cóc mình...', '2025-10-31', 100,
                'https://image.tmdb.org/t/p/original/6TkmCylovIEHbZF9jLiUhdeM9BF.jpg',
                'https://image.tmdb.org/t/p/original/oe2TOWykcLSGq67XPH4Bb0N1oU3.jpg',
                'Scott Derrickson',
                '[
                  "Ethan Hawke",
                  "Mason Thames",
                  "Madeleine McGraw",
                  "Demián Bichir",
                  "Miguel Mora"
                ]'::jsonb),

               ('Predator: Badlands', 'Quái Thú Vô Hình: Vùng Đất Chết Chóc',
                'Trong tương lai, tại một hành tinh hẻo lánh...', '2025-11-07', 100,
                'https://image.tmdb.org/t/p/original/6aPy2tMgQLVz2IcifrL1Z2Q9u1t.jpg',
                'https://image.tmdb.org/t/p/original/82lM4GJ9uuNvNDOEpxFy77uv4Ak.jpg',
                'Dan Trachtenberg',
                '[
                  "Elle Fanning",
                  "Dimitrius Schuster-Koloamatangi",
                  "Rohinal Nayaran",
                  "Michael Homick",
                  "Stefan Grube"
                ]'::jsonb),

               ('Good Fortune', 'Vận May', 'Gabriel, một thiên thần thừa lòng tốt nhưng thiếu kỹ năng...', '2025-10-17',
                100,
                'https://image.tmdb.org/t/p/original/gLfJe9CDEhROt3npmOA6roBHmzZ.jpg',
                'https://image.tmdb.org/t/p/original/q2V1q2Xxwqg3uXQKufpdCtrnAdn.jpg',
                'Aziz Ansari',
                '[
                  "Keanu Reeves",
                  "Aziz Ansari",
                  "Seth Rogen",
                  "Keke Palmer",
                  "Sandra Oh"
                ]'::jsonb),

               ('TRON: Ares', 'Trò Chơi Ảo Giác: Ares', 'Một chương trình trí tuệ nhân tạo siêu việt...', '2025-10-09',
                100,
                'https://image.tmdb.org/t/p/original/lj7imLGAzI3zKvbJtPH01aYW9lU.jpg',
                'https://image.tmdb.org/t/p/original/2OvpmWYrsv8eMyV3AAqhoMnzMF.jpg',
                'Joachim Rønning',
                '[
                  "Jared Leto",
                  "Greta Lee",
                  "Evan Peters",
                  "Gillian Anderson",
                  "Jodie Turner-Smith"
                ]'::jsonb),

               ('Good Boy', 'Chó Cưng Đừng Sợ', 'Một ngôi nhà cũ, một khởi đầu tưởng như bình yên...', '2025-10-24',
                100,
                'https://image.tmdb.org/t/p/original/6W3VeKTpuSK34pQ6z62eisFwg7u.jpg',
                'https://image.tmdb.org/t/p/original/y47aBf7GFdcwtdmCxEis14hPZS4.jpg',
                'Ben Leonberg',
                '[
                  "Indy",
                  "Shane Jensen",
                  "Larry Fessenden",
                  "Arielle Friedman",
                  "Stuart Rudin"
                ]'::jsonb),

               ('ゴジラ-1.0', 'Godzilla Minus One', 'Ở Nhật Bản thời hậu chiến, một cựu phi công...', '2025-11-07', 100,
                'https://image.tmdb.org/t/p/original/buvBq2zLP7CcJth8tjrI4znvfEO.jpg',
                'https://image.tmdb.org/t/p/original/1FMnXfgPFJFWhPrCZBgXwHbwmye.jpg',
                'Takashi Yamazaki',
                '[
                  "神木隆之介",
                  "浜辺美波",
                  "山田裕貴",
                  "青木崇高",
                  "吉岡秀隆"
                ]'::jsonb),

               ('劇場版総集編 呪術廻戦 懐玉・玉折', 'Chú Thuật Hồi Chiến: Hoài Ngọc / Ngọc Chiết - The Movie',
                'PHIM ĐIỆN ẢNH...', '2025-10-10', 100,
                'https://image.tmdb.org/t/p/original/7n15cgWGVEqffcUJmYlTeltO1uP.jpg',
                'https://image.tmdb.org/t/p/original/w8j0HVX7xasNVGAva2T3W4ncoN4.jpg',
                '御所園翔太',
                '[
                  "中村悠一",
                  "櫻井孝宏",
                  "永瀬アンナ",
                  "子安武人",
                  "遠藤綾"
                ]'::jsonb),

               ('Anniversary', 'Bí Mật Sau Bữa Tiệc', '', '2025-10-31', 100,
                'https://image.tmdb.org/t/p/original/tCLn5DyGjRwZiSX4ABCxpZS4QvM.jpg',
                'https://image.tmdb.org/t/p/original/dXAiXPMadVuIsvEGf4fPi7OfO4f.jpg',
                'Jan Komasa',
                '[
                  "Diane Lane",
                  "Kyle Chandler",
                  "Madeline Brewer",
                  "Zoey Deutch",
                  "Mckenna Grace"
                ]'::jsonb),

               ('얼굴', 'Nhân Diện', 'Im Dong-hwan, chàng trai chưa từng biết mặt mẹ mình...', '2025-10-03', 100,
                'https://image.tmdb.org/t/p/original/horybPDulhrSqAVXRyac4zjFAx5.jpg',
                'https://image.tmdb.org/t/p/original/wduUhYLGaYSD2mSu7YHd09l1N6j.jpg',
                '연상호',
                '[
                  "박정민",
                  "권해효",
                  "신현빈",
                  "한지현",
                  "임성재"
                ]'::jsonb),

               ('Kitab Sijjin & Illiyyin', 'Lọ Lem Chơi Ngải', '', '2025-11-07', 100,
                'https://image.tmdb.org/t/p/original/ow9R2JE4AG9PwRm9KJIDGw6r9ce.jpg',
                'https://image.tmdb.org/t/p/original/8O5dKufZ97eVOvEgt1C3Q6T8Lme.jpg',
                'Hadrah Daeng Ratu',
                '[
                  "Yunita Siregar",
                  "Dinda Kanyadewi",
                  "Tarra Budiman",
                  "Djenar Maesa Ayu",
                  "Kawai Labiba"
                ]'::jsonb),

               ('風立ちぬ', 'Gió Vẫn Thổi', 'Nhà làm phim hoạt hình Miyazaki Hayao...', '2025-10-17', 100,
                'https://image.tmdb.org/t/p/original/b6DNmz3sZCPv18s2uzvpmFFvMS8.jpg',
                'https://image.tmdb.org/t/p/original/938lqhAQaO3hmLg44VbUR7OqlMs.jpg',
                '宮崎駿',
                '[
                  "庵野秀明",
                  "西島秀俊",
                  "瀧本美織",
                  "西村雅彥",
                  "Stephen Alpert"
                ]'::jsonb),

               ('나혼자 프린스', 'Tay Anh Giữ Một Vì Sao', 'Siêu sao Kang Jun Woo – “Hoàng tử Châu Á” –...', '2025-10-03',
                100,
                'https://image.tmdb.org/t/p/original/1mqJZHJ4KQNduyWsc3EFzfRj6Kg.jpg',
                'https://image.tmdb.org/t/p/originalnull',
                '김성훈',
                '[
                  "이광수",
                  "Hoàng Hà",
                  "Duy Khánh Zhou Zhou",
                  "Cù Thị Trà",
                  "음문석"
                ]'::jsonb),

               ('他年她日', 'Năm Của Anh, Ngày Của Em', 'Khi thế giới bị chia cắt thành hai chiều...', '2025-10-17',
                100,
                'https://image.tmdb.org/t/p/original/7CSO29w9RYLY9R6TVLTkGy0oMIm.jpg',
                'https://image.tmdb.org/t/p/original/n3mqsvKiqElRQ4KjDQ0NADQPVP5.jpg',
                'Benny Kung',
                '[
                  "Hứa Quang Hán",
                  "袁澧林",
                  "Jack Tan",
                  "董瑋",
                  "陳輝虹"
                ]'::jsonb),

               ('Sihir Pelakor', 'Xà Thuật Tiểu Tam', 'Vita – một nữ sinh trung học –...', '2025-10-24', 100,
                'https://image.tmdb.org/t/p/original/n4YGTt7Oju3MM91QxaArXMFOOu8.jpg',
                'https://image.tmdb.org/t/p/original/nvUBmJrwEaIYgPuXI5cukEucPXp.jpg',
                'Bobby Prasetyo',
                '[
                  "Anodya Shula Neona Ayu",
                  "Marcella Zalianty",
                  "Al Fathir Muchtar",
                  "Asmara Abigail",
                  "Jared Ali"
                ]'::jsonb),

               ('ธี่หยด 3', 'TEE YOD: QUỶ ĂN TẠNG PHẦN 3', 'Yak và gia đình phải đối mặt với nỗi kinh hoàng mới...',
                '2025-10-10', 100,
                'https://image.tmdb.org/t/p/original/kcmymlJPZ3mDQbKht20XRGBogd2.jpg',
                'https://image.tmdb.org/t/p/original/qZKxxIGL1wsjpJ7U38WrMwolcjr.jpg',
                'Narint Yuvaboon',
                '[
                  "ณเดชน์ คูกิมิยะ",
                  "องอาจ เจียมเจริญพรกุล",
                  "กาจบัณฑิต ใจดี",
                  "พีระกฤตย์ พชรบุณยเกียรติ",
                  "เจลีลชา คัปปุน"
                ]'::jsonb),

               ('지드래곤 인 시네마 [위버맨쉬]', '지드래곤 인 시네마 [위버맨쉬]', '', '2025-11-11', 100,
                'https://image.tmdb.org/t/p/original/55lQvgGiL9DBsGgk8QsNWugKxvw.jpg',
                'https://image.tmdb.org/t/p/original/smPhK3Ytb7x7VjMOm9zdN7Rbpev.jpg',
                '변진호',
                '[
                  "지드래곤",
                  "태양",
                  "대성",
                  "CL"
                ]'::jsonb),

               ('연의 편지', 'Những Lá Thư Của Yeon', '', '2025-10-10', 100,
                'https://image.tmdb.org/t/p/original/y1WnHAqau3QxPPy4S1Spepa0ZXN.jpg',
                'https://image.tmdb.org/t/p/original/thsAU92Ei2Nbm38ZdkvHI8xLaSc.jpg',
                '김용환',
                '[
                  "이수현",
                  "김민주",
                  "민승우",
                  "남도형"
                ]'::jsonb),

               ('Мальчик-дельфин 2', 'Cậu Bé Cá Heo: Bí Mật 7 Đại Dương', '', '2025-10-03', 100,
                'https://image.tmdb.org/t/p/original/rhgCJq2bgKhGQbxwSkKeYLlHdO8.jpg',
                'https://image.tmdb.org/t/p/originalnull',
                'Яна Кузьмина',
                '[
                  "Полина Авдеенко",
                  "Юлия Рудина",
                  "Юлия Зоркина",
                  "Александр Васильев",
                  "Борис Хасанов"
                ]'::jsonb),

               ('Cải Mã', 'Cải Mã', '', '2025-10-31', 100,
                'https://image.tmdb.org/t/p/original/qxQEzKp5WI5Ra9joAt4KVv4LdM7.jpg',
                'https://image.tmdb.org/t/p/originalnull',
                'Thắng Vũ',
                '[
                  "Kim Hải",
                  "Rima Thanh Vy",
                  "Hoàng Mèo",
                  "Kiều Trinh",
                  "Lương Anh Vũ"
                ]'::jsonb),

               ('Cục Vàng Của Ngoại', 'Cục Vàng Của Ngoại', 'Lấy cảm hứng từ những ký ức tuổi thơ ngọt ngào...',
                '2025-10-17', 100,
                'https://image.tmdb.org/t/p/original/jv2bu10yEL3UgBqdULUahMDemh.jpg',
                'https://image.tmdb.org/t/p/original/mQEtRC3l1b1yq0NWRpEvPmOFnu5.jpg',
                'Khương Ngọc',
                '[
                  "Hồng Đào",
                  "Hữu Châu",
                  "Việt Hương",
                  "Lê Khánh",
                  "Băng Di"
                ]'::jsonb);

-- Insert movie_genre (tự động lấy id movie theo thứ tự insert)
        INSERT INTO movie_genre (movie_id, genre_id)
        VALUES (1, 27),
               (1, 53),
               (2, 28),
               (2, 878),
               (2, 12),
               (3, 35),
               (3, 14),
               (4, 878),
               (4, 12),
               (4, 28),
               (5, 27),
               (5, 53),
               (6, 878),
               (6, 27),
               (6, 28),
               (7, 16),
               (7, 28),
               (7, 14),
               (8, 53),
               (8, 18),
               (9, 9648),
               (9, 53),
               (10, 27),
               (10, 53),
               (11, 18),
               (11, 16),
               (11, 10749),
               (11, 10752),
               (11, 36),
               (12, 10749),
               (12, 35),
               (13, 14),
               (13, 10749),
               (13, 878),
               (14, 27),
               (14, 53),
               (15, 27),
               (15, 28),
               (15, 53),
               (16, 99),
               (16, 10402),
               (17, 16),
               (17, 18),
               (17, 9648),
               (17, 12),
               (18, 16),
               (19, 27),
               (20, 10751),
               (20, 18);

    END;
$$;
