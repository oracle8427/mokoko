package mokoko.contact;

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

    public GroupController(GroupService groupService, UserWrapperService userWrapperService) {
        this.groupService = groupService;
        this.userWrapperService = userWrapperService;
    }

    @GetMapping("")
    public List<Group> getGroups() {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
        Map<String, Object> map = new HashMap<>();
        map.put("userID", username);
        return groupService.getGroups(map);
    }

    @PostMapping(value = "", headers = "Content-Type=application/x-www-form-urlencoded")
    public ResponseEntity<?> createGroup(@RequestParam String model) {
        Group group = JacksonJsonUtil.readValue(model, Group.class);
        groupService.createGroup(group);
        return ResponseEntity.ok(group);
    }

    @PostMapping(value = "order", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PATCH")
    public ResponseEntity<?> updateSortOrder(@RequestParam String model) {
        System.out.println(model);
        Map<String, Object> params = JacksonJsonUtil.readValueAsMap(model);
        Object value = params.get("idList");

        if (!(value instanceof List))
            throw new BadRequestException("Bad Parameter.");

        List<?> idList = (List<?>) value;
        groupService.updateSortOrder(idList);
        return ResponseEntity.ok(idList);
    }

}
