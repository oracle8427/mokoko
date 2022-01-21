package mokoko.contacts;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ContactMapper {

    List<Contact> selectAllContacts(String userID);

    Contact selectContact(int id);

    List<Contact> selectGroupContacts(Map<String, Object> params);

    List<Integer> selectIDListAtGroup(int groupID);

    int selectAllCount(Map<String, Object> params);

    int selectImportantCount(Map<String, Object> params);

    int selectRecentCount(Map<String, Object> params);

    int deleteContact(int id);

    int deleteContactExpansion(int contactID);

    int deleteContactRecent(int contactID);

    int unlinkGroup(int contactID);

    int unlinkAllGroup(List<?> idList);

    void moveToGroup(Map<String, Object> params);

    int insertContact(ContactEntity contact);

    int insertContactExpansion(ContactExpansionEntity contactExpansion);

    int insertContactExpansions(List<? extends ContactExpansionEntity> contactExpansions);

    int updateContact(Contact contact);

    int updateContact(Map<String, Object> contact);

}
