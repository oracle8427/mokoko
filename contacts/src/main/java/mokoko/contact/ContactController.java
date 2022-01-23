package mokoko.contact;

import com.fasterxml.jackson.core.type.TypeReference;
import mokoko.contacts.*;
import mokoko.error.BadRequestException;
import mokoko.error.NotFoundException;
import mokoko.user.UserWrapperService;
import mokoko.util.IOUtil;
import mokoko.util.jackson.JacksonJsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.*;

@RestController
@RequestMapping("contacts")
public class ContactController {

    @Autowired
    private WebApplicationContext webApplicationContext;

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
        List<Contact> contacts;
        if (params.containsKey("groupID"))
            contacts = contactService.getGroupContacts(params);
        else if (params.containsKey("trash")) {
            Group trash = groupService.getTrash();
            params.put("groupID", trash.getId());
            contacts = contactService.getGroupContacts(params);
        } else
            contacts = contactService.getAllContacts(username);
        return contacts;
    }

    @GetMapping("page")
    public ContactPaginator getContactPaginator(@RequestParam Map<String, Object> params) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");

        params.put("userID", username);
        ContactPaginator paginator = new ContactPaginator();
        if (params.containsKey("trash")) {
            Group trash = groupService.getTrash();
            params.put("groupID", trash.getId());
            paginator.setParameters(params);
            paginator.setEdges(contactService.getGroupContactPaginator(paginator));
            paginator.setTotalRecords(contactService.getTrashCount(params));
        } else {
            paginator.setParameters(params);
            paginator.setEdges(contactService.getContactPaginator(paginator));
            paginator.setTotalRecords(contactService.getAllCount(params));
        }
        return paginator;
    }

    @PostMapping(value = "trash", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PATCH")
    public ResponseEntity<?> moveToTrash(@RequestParam String model) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
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
        return ResponseEntity.ok(params);
    }

    @PostMapping(value = "import", headers = "Content-Type=application/x-www-form-urlencoded")
    public ResponseEntity<?> importContact(@RequestParam String model) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
        Map<String, List<Contact>> map = JacksonJsonUtil.readValue(model, new TypeReference<Map<String, List<Contact>>>() {
        });

        List<Contact> contacts = map.get("contacts");
        if (contacts == null || contacts.size() == 0)
            throw new BadRequestException("contacts is null: " + model);

        for (Contact contact : contacts) {
            contact.setOwner(username);
            contactService.createContact(contact);
        }
        return ResponseEntity.ok(map);
    }

    @GetMapping(value = "import/sample")
    public void downloadSampleExcel(HttpServletResponse response) {
        String path = "classpath:doc/kakaomail_contacts_sample.xlsx";
        InputStream in = null;
        OutputStream out = null;
        try {
            Resource resource = webApplicationContext.getResource(path);
            response.setCharacterEncoding("UTF-8");
            response.addHeader("Content-Length", String.valueOf(resource.contentLength()));
            response.setContentType("application/vnd.ms-excel; charset=" + "UTF-8");
            response.setHeader("Content-disposition", "attachment;filename=" + resource.getFilename());

            in = IOUtil.newBufferedInputStream(resource.getInputStream());
            out = IOUtil.newBufferedOutputStream(response.getOutputStream());
            IOUtil.transfer(in, out);
        } catch (IOException ioe) {
            log.error("Error at ContactController.downloadSampleExcel webApplicationContext.getResource(" + path + ")", ioe);
        } finally {
            IOUtil.close(in);
            IOUtil.close(out);
        }
    }

    @PostMapping(value = "{contactID}", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PUT")
    public Contact putContact(@PathVariable int contactID, @RequestParam String model) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
        Contact contact = JacksonJsonUtil.readValue(model, Contact.class);
        log.debug("PUT: " + contact);
        contactService.putContact(contact);
        return contactService.getContact(contactID);
    }

    @PostMapping(value = "{contactID}", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=PATCH")
    public ResponseEntity<?> updateContact(@PathVariable int contactID, @RequestParam String model) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
        Contact contact = JacksonJsonUtil.readValue(model, Contact.class);
        contact.setOwner(username);

        contactService.updateContact(contact);
        return ResponseEntity.ok(new HashMap<String, Integer>() {{
            put("id", contactID);
            put("important", contact.getImportant());
        }});
    }

    @PostMapping(headers = "Content-Type=application/x-www-form-urlencoded")
    public Contact createContact(@RequestParam String model) {
        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");
        Contact contact = JacksonJsonUtil.readValue(model, Contact.class);
        contact.setOwner(username);
        contactService.createContact(contact);
        return contactService.getContact(contact.getId());
    }

    @PostMapping(value = "remove", headers = "Content-Type=application/x-www-form-urlencoded", params = "_method=DELETE")
    public ResponseEntity<?> removeContacts(@RequestParam int[] idList) {
        if (idList.length == 0)
            throw new BadRequestException("Bad Parameter. Size is zero");

        String username = userWrapperService.getUsername();
        if (username == null || username.length() == 0)
            throw new NotFoundException("Not Found User");

        Map<String, Object> params = new HashMap<>();
        params.put("userID", username);
        params.put("idList", idList);
        List<Integer> contactIDList = contactService.getIDList(params);
        if (contactIDList.size() != idList.length)
            throw new BadRequestException("Invalid Contact IDList");

        contactService.removeContactByUser(contactIDList);
        return ResponseEntity.ok(params);
    }

}
