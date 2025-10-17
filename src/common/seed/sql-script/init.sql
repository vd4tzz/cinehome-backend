insert into roles (name) values ('USER');

-- password: prx12345
insert into users (email, password, is_verified, o_auth2_provider) values ('prx@prx.com', '$2a$10$PwD282xnLj5lUl/GD33m6..kk6CwaBsxtJJhwOnKPfHuKwC13Vqoi', true, 'NONE');

insert into user_role (user_id, role_id) values (1, 1);