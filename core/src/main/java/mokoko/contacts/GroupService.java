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

    public GroupService(GroupMapper groupMapper) {
        this.groupMapper = groupMapper;
    }

    public List<Group> getGroups(Map<String, Object> params) {
        return groupMapper.selectGroups(params);
    }

    public int createGroup(Group group) {
        return groupMapper.insertGroup(group);
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

    public int deleteGroup() {
        List<Integer> idList = new ArrayList<>();
        if (idList.size() > 0)
            return groupMapper.deleteGroup(idList);
        return 0;
    }

}
