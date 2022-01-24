ALTER TABLE users ADD COLUMN `auth` VARCHAR(1) NOT NULL DEFAULT 'U';
CREATE TABLE groups (
    id INT NOT NULL AUTO_INCREMENT,
    group_name varchar(100) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE group_permission (
    group_id INT NOT NULL,
    users_auth char(1) NOT NULL,
    KEY group_permission_fk (group_id),
    CONSTRAINT group_permission_fk FOREIGN KEY (group_id) REFERENCES groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE group_authorities (
    group_id INT NOT NULL,
    authority varchar(50) NOT NULL,
    KEY group_authorities_fk (group_id),
    CONSTRAINT group_authorities_fk FOREIGN KEY (group_id) REFERENCES groups (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO groups(group_name) VALUE ('Users');
INSERT INTO groups(group_name) VALUE ('Administrators');


INSERT INTO group_authorities(group_id, authority)
SELECT id, 'ROLE_USER' FROM groups WHERE group_name = 'Users';

INSERT INTO group_authorities(group_id, authority)
SELECT id, 'ROLE_USER' FROM groups WHERE group_name = 'Administrators';
INSERT INTO group_authorities(group_id, authority)
SELECT id, 'ROLE_ADMIN' FROM groups WHERE group_name = 'Administrators';


INSERT INTO group_permission(group_id, users_auth)
SELECT id, 'U' FROM groups WHERE group_name = 'Users';
INSERT INTO group_permission(group_id, users_auth)
SELECT id, 'A' FROM groups WHERE group_name = 'Administrators';