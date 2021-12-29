CREATE TABLE users (
    id varchar(200) NOT NULL,
    name varchar(50) NOT NULL,
    passwd varchar(200) NOT NULL,
    lang varchar(10) NOT NULL DEFAULT 'ko',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users(id, name, passwd)
VALUES ('mailmaster@mokoko.shop', '관리자', '$2a$10$ge/eQ9D9GLstFw1.VLN7weDWHyal3bjWxskPz0RxDsl/INCSv5wb.');