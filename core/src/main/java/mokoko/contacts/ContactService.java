package mokoko.contacts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class ContactService {

    private final ContactMapper contactMapper;

    public ContactService(ContactMapper contactMapper) {
        this.contactMapper = contactMapper;
    }

    public List<Contact> getAllContacts(String userID) {
        return contactMapper.selectAllContacts(userID);
    }

    public List<Contact> getGroupContacts(Map<String, Object> params) {
        return contactMapper.selectGroupContacts(params);
    }

    public List<Integer> getIDListAtGroup(int groupID) {
        return contactMapper.selectIDListAtGroup(groupID);
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

    public int unLinkGroupByContactID(int contactID) {
        return contactMapper.unlinkGroup(contactID);
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void deleteContact(int id) {
        // 최근 주소록에서 제거
        contactMapper.deleteContactRecent(id);

        // 주소록 확장 정보 제거
        contactMapper.deleteContactExpansion(id);

        // 주소록이 속해있는 모든 그룹과의 연결 해제
        unLinkGroupByContactID(id);

        // 주소록 제거
        contactMapper.deleteContact(id);
    }
}
