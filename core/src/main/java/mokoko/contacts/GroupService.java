package mokoko.contacts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroupService {

    private final GroupMapper groupMapper;

    private final ContactService contactService;

    public GroupService(GroupMapper groupMapper, ContactService contactService) {
        this.groupMapper = groupMapper;
        this.contactService = contactService;
    }

    public Group getGroup(Map<String, Object> params) {
        return groupMapper.selectGroup(params);
    }

    public List<Group> getGroups(Map<String, Object> params) {
        return groupMapper.selectGroups(params);
    }

    public int createGroup(Group group) {
        return groupMapper.insertGroup(group);
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void removeGroupAndMoveContacts(int groupID) {
        contactService.unLinkGroup(groupID);
        groupMapper.deleteGroup(groupID);
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public void updateSortOrder(List<?> idList) {
        for (int i = 0; i < idList.size(); i++) {
            Map<String, Object> params = new HashMap<>();
            params.put("id", idList.get(i));
            params.put("sortNumber", i);
            updateGroup(params);
        }
    }

    public int updateGroup(Map<String, Object> params) {
        return groupMapper.updateGroup(params);
    }



}
