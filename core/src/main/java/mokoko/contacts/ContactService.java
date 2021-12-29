package mokoko.contacts;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

	private final ContactMapper contactMapper;

	public ContactService(ContactMapper contactMapper) {
		this.contactMapper = contactMapper;
	}

	public List<Contact> getContacts() {
		return contactMapper.selectContacts();
	}

}
