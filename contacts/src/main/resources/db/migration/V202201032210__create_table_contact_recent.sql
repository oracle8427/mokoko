CREATE TABLE contact_recent (
    id		INT NOT NULL AUTO_INCREMENT,
    contact_id INT NOT NULL DEFAULT 0,
    user_id    VARCHAR(200) DEFAULT NULL,
    created datetime default now(),
    PRIMARY KEY (id),
    CONSTRAINT contact_recent_fk_contact_id FOREIGN KEY (contact_id) REFERENCES contact (id),
    CONSTRAINT contact_recent_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;