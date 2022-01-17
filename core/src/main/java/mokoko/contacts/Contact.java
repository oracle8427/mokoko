package mokoko.contacts;

import java.util.List;

public class Contact extends ContactEntity {

    private List<ContactExpansion> contactExpansions;

    public List<ContactExpansion> getContactExpansions() {
        return contactExpansions;
    }

    private List<Group> groups;

    public List<Group> getGroups() {
        return groups;
    }

    public void setOwner(String ownerID) {
        this.userID = ownerID;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n").append(super.toString());
        if (contactExpansions != null && contactExpansions.size() > 0) {
            sb.append("\n\tcontactExpansions=[\n");
            for (ContactExpansion contactExpansion : contactExpansions)
                sb.append("\t\t").append(contactExpansion).append("\n");
            sb.append('\t');
        }
        if (groups != null && groups.size() > 0) {
            sb.append("\n\tgroupIDList=[\n");
            for (Group group : groups)
                sb.append("\t\t").append(group.getId()).append("\n");
            sb.append('\t');
        }
        return sb.toString();
    }
}
