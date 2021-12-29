CREATE TABLE contact_expansion (
    id		INT NOT NULL AUTO_INCREMENT,
    contact_id INT NOT NULL DEFAULT 0,
    phone VARCHAR(20) DEFAULT NULL,
    phone_type VARCHAR(10) DEFAULT NULL,
    messenger VARCHAR(30) DEFAULT NULL,
    address VARCHAR(200) DEFAULT NULL,
    address_type VARCHAR(10) DEFAULT NULL,
    special_day date default null,
    special_day_type VARCHAR(15) DEFAULT NULL,
    email	VARCHAR(200) DEFAULT NULL,
    sort_no INT NOT NULL DEFAULT 0,
    created datetime default now(),
    PRIMARY KEY (id),
    CONSTRAINT contact_expansion_fk_contact_id FOREIGN KEY (contact_id) REFERENCES contact (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;