CREATE TABLE users
(
    id     varchar(200) NOT NULL,
    name   varchar(50)  NOT NULL,
    passwd varchar(200) NOT NULL,
    lang   varchar(10)  NOT NULL DEFAULT 'ko',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users(id, name, passwd)
VALUES ('mailmaster@mokoko.shop', '관리자', '$2a$10$ge/eQ9D9GLstFw1.VLN7weDWHyal3bjWxskPz0RxDsl/INCSv5wb.');

CREATE TABLE contact_group
(
    id         INT          NOT NULL AUTO_INCREMENT,
    user_id    VARCHAR(200) DEFAULT NULL,
    name       VARCHAR(100) NOT NULL,
    sort_no    INT          NOT NULL DEFAULT 0,
    group_type TINYINT(4) DEFAULT 0,
    PRIMARY KEY (id),
    KEY        contact_group_ix_user_id (user_id),
    KEY        contact_group_ix_sort_no (sort_no)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO contact_group(user_id, name, group_type)
VALUES ('mailmaster@mokoko.shop', '휴지통', 2);

CREATE TABLE contact
(
    id           INT         NOT NULL AUTO_INCREMENT,
    group_id     INT         NOT NULL DEFAULT 0,
    user_id      VARCHAR(200)         DEFAULT NULL,
    fullname     VARCHAR(100)         DEFAULT NULL,
    firstname    VARCHAR(50) NOT NULL,
    lastname     VARCHAR(50)          DEFAULT NULL,
    nickname     VARCHAR(100)         DEFAULT NULL,
    birth        VARCHAR(50)          DEFAULT null,
    organization VARCHAR(100)         DEFAULT NULL,
    position     varchar(30)          DEFAULT NULL,
    sort_no      INT         NOT NULL DEFAULT 0,
    notes        VARCHAR(1000)        DEFAULT NULL,
    important    TINYINT(4) DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT contact_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE contact_contact_group
(
    contact_id INT NOT NULL,
    group_id   INT NOT NULL,
    CONSTRAINT ccg_fk_contact_id FOREIGN KEY (contact_id) REFERENCES contact (id),
    CONSTRAINT ccg_fk_group_id FOREIGN KEY (group_id) REFERENCES contact_group (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE contact_expansion
(
    id               INT NOT NULL AUTO_INCREMENT,
    contact_id       INT NOT NULL DEFAULT 0,
    phone            VARCHAR(20)  DEFAULT NULL,
    phone_type       VARCHAR(10)  DEFAULT NULL,
    messenger        VARCHAR(30)  DEFAULT NULL,
    address          VARCHAR(200) DEFAULT NULL,
    address_type     VARCHAR(10)  DEFAULT NULL,
    special_day      VARCHAR(50) NULL null,
    special_day_type VARCHAR(15)  DEFAULT NULL,
    email            VARCHAR(200) DEFAULT NULL,
    sns              VARCHAR(200) DEFAULT NULL,
    sns_type         VARCHAR(10)  DEFAULT NULL,
    sort_no          INT NOT NULL DEFAULT 0,
    created          datetime     default now(),
    PRIMARY KEY (id),
    CONSTRAINT contact_expansion_fk_contact_id FOREIGN KEY (contact_id) REFERENCES contact (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE contact_recent
(
    id         INT NOT NULL AUTO_INCREMENT,
    contact_id INT NOT NULL DEFAULT 0,
    user_id    VARCHAR(200) DEFAULT NULL,
    created    datetime     default now(),
    PRIMARY KEY (id),
    CONSTRAINT contact_recent_fk_contact_id FOREIGN KEY (contact_id) REFERENCES contact (id),
    CONSTRAINT contact_recent_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;