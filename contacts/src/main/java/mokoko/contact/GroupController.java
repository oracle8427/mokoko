package mokoko.contact;

import mokoko.contacts.ContactService;
import mokoko.contacts.Group;
import mokoko.contacts.GroupService;
import mokoko.error.BadRequestException;
import mokoko.error.NotFoundException;
import mokoko.user.UserWrapperService;
import mokoko.util.jackson.JacksonJsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("groups")
public class GroupController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private final GroupService groupService;

    private final UserWrapperService userWrapperService;

    private final ContactService contactService;

    public GroupController(GroupService groupService, UserWrapperService userWrapperService,
                           ContactService contactService) {
        this.groupService = groupService;
        this.userWrapperService = userWrapperService;
        this.contactService = contactService;
    }

    @GetMapping("")
    public List<Group> getGroups() {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
        Map<String, Object> map = new HashMap<>();
        map.put("userID", username);
        map.put("groupType", Group.USER);
        return groupService.getGroups(map);
    }

    @PostMapping(value = "", headers = "Content-Type=application/x-www-form-urlencoded")
    public ResponseEntity<?> createGroup(@RequestParam String model) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");

        Group group = JacksonJsonUtil.readValue(model, Group.class);
        group.setUserID(username);
        group.setGroupType(Group.USER);
        groupService.createGroup(group);
        return ResponseEntity.ok(group);
    }

    @PostMapping(value = "{id}", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=DELETE")
    public ResponseEntity<?> removeGroup(@PathVariable int id, @RequestParam String mode) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");

        if ("group".equals(mode)) {
            groupService.removeGroupAndMoveContacts(id);
        } else if ("all".equals(mode)) {
            // TODO: remove contacts && group && unlink other groups...
        } else {
            throw new BadRequestException("unknown");
        }
        return ResponseEntity.ok(id);
    }

    @PostMapping(value = "order", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PATCH")
    public ResponseEntity<?> updateSortOrder(@RequestParam String model) {
        Map<String, Object> params = JacksonJsonUtil.readValueAsMap(model);
        Object value = params.get("idList");

        if (!(value instanceof List))
            throw new BadRequestException("Bad Parameter.");

        List<?> idList = (List<?>) value;
        groupService.updateSortOrder(idList);
        return ResponseEntity.ok(idList);
    }

    @GetMapping("count")
    public ResponseEntity<?> getGroupCount(@RequestParam List<String> condition) {
        if (condition.size() == 0)
            throw new BadRequestException("Bad Parameter.");

        Map<String, Object> params = new HashMap<>();
        params.put("userID", userWrapperService.getUsername());

        Map<String, Object> response = new HashMap<>();
        if (condition.contains("all"))
            response.put("all", contactService.getAllCount(params));
        if (condition.contains("recently"))
            response.put("recently", contactService.getRecentCount(params));
        if (condition.contains("important"))
            response.put("important", contactService.getImportantCount(params));
        return ResponseEntity.ok(response);
    }

}
