package mokoko.contact;

import mokoko.contacts.Contact;
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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("contacts")
public class ContactController {


    private final Logger log = LoggerFactory.getLogger(getClass());

    private final UserWrapperService userWrapperService;

    private final ContactService contactService;

    private final GroupService groupService;

    public ContactController(UserWrapperService userWrapperService,
                             ContactService contactService,
                             GroupService groupService) {
        this.userWrapperService = userWrapperService;
        this.contactService = contactService;
        this.groupService = groupService;
    }

    @GetMapping("")
    public List<Contact> getContacts(@RequestParam Map<String, Object> params) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");

        params.put("userID", username);
        return params.containsKey("groupID") ?
                contactService.getGroupContacts(params) :
                contactService.getAllContacts(username);
    }

    @PostMapping(value = "trash", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PATCH")
    public ResponseEntity<?> moveToTrash(@RequestParam String model) {
        Map<String, Object> params = JacksonJsonUtil.readValueAsMap(model);
        Object value = params.get("idList");
        if (!(value instanceof List))
            throw new BadRequestException("Bad Parameter.");

        Group trash = groupService.getTrash();
        if (trash == null || trash.getId() == 0)
            throw new NotFoundException("Not Found Trash");

        List<?> idList = (List<?>) value;
        contactService.moveToTrash(idList, trash.getId());
        return ResponseEntity.ok(idList);
    }

    @PostMapping(value = "move", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PUT")
    public ResponseEntity<?> moveToGroup(@RequestParam String model) {
        Map<String, Object> params = JacksonJsonUtil.readValueAsMap(model);
        if (!(params.get("contactIDList") instanceof List) || !(params.get("groupIDList") instanceof List))
            throw new BadRequestException("Bad Parameter.");

        List<?> contactIDList = (List<?>) params.get("contactIDList");
        List<?> groupIDList = (List<?>) params.get("groupIDList");
        contactService.moveToGroup(contactIDList, groupIDList);

        return ResponseEntity.ok(contactIDList);
    }

}
