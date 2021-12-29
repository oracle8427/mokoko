CREATE TABLE contact (
    id		INT NOT NULL AUTO_INCREMENT,
    group_id INT NOT NULL DEFAULT 0,
    user_id    VARCHAR(200) DEFAULT NULL,
    fullname   VARCHAR(100) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname  VARCHAR(50) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    birth date default null,
    organization VARCHAR(100) NOT NULL,
    position varchar(30) NOT NULL,
    sort_no INT NOT NULL DEFAULT 0,
    notes  VARCHAR(1000) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT contact_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;