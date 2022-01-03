CREATE TABLE contact_contact_group (
    contact_id INT NOT NULL,
    group_id INT NOT NULL,
    CONSTRAINT ccg_fk_contact_id FOREIGN KEY (contact_id) REFERENCES contact (id),
    CONSTRAINT ccg_fk_group_id FOREIGN KEY (group_id) REFERENCES contact_group (id)
) ENGINE=innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;