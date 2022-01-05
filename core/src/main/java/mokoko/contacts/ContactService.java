package mokoko.contacts;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ContactService {

    private final ContactMapper contactMapper;

    public ContactService(ContactMapper contactMapper) {
        this.contactMapper = contactMapper;
    }

    public List<Contact> getContacts() {
        return contactMapper.selectContacts();
    }

    public int getAllCount(Map<String, Object> params) {
        return contactMapper.selectAllCount(params);
    }

    public int getImportantCount(Map<String, Object> params) {
        return contactMapper.selectImportantCount(params);
    }

    public int getRecentCount(Map<String, Object> params) {
        return contactMapper.selectRecentCount(params);
    }

    public int unLinkGroup(int groupID) {
        return contactMapper.deleteGroupID(groupID);
    }
}
