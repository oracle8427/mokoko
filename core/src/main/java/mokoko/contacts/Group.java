package mokoko.contacts;

public class Group extends GroupEntity {

    public static final int USER = 0;
    public static final int TRASH = 1;

    private long contactsCount;

    public long getContactsCount() {
        return contactsCount;
    }

    @Override
    public String toString() {
        return super.toString() + "Group{" +
                "contactsCount=" + contactsCount + "}";
    }
}
