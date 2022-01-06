package mokoko.contact;

import mokoko.contacts.Contact;
import mokoko.contacts.ContactService;
import mokoko.contacts.Group;
import mokoko.contacts.GroupService;
import mokoko.error.NotFoundException;
import mokoko.user.UserWrapperService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("contacts")
public class ContactController {


    private final Logger log = LoggerFactory.getLogger(getClass());

    private final UserWrapperService userWrapperService;

    private final ContactService contactService;

    public ContactController(UserWrapperService userWrapperService, ContactService contactService, GroupService groupService) {
        this.userWrapperService = userWrapperService;
        this.contactService = contactService;
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


}
