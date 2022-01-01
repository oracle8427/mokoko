package mokoko.contacts;

public class GroupEntity {

    private int id;
    private String userID;
    private String name;
    private int important;
    private int groupType;
    private int sortNumber;

    public GroupEntity() {

    }

    public GroupEntity(int id, String userID, String name, int important, int groupType, int sortNumber) {
        this.id = id;
        this.userID = userID;
        this.name = name;
        this.important = important;
        this.groupType = groupType;
        this.sortNumber = sortNumber;
    }

    public int getId() {
        return id;
    }

    public String getUserID() {
        return userID;
    }

    public String getName() {
        return name;
    }

    public int getImportant() {
        return important;
    }

    public int getGroupType() {
        return groupType;
    }

    public int getSortNumber() {
        return sortNumber;
    }

    @Override
    public String toString() {
        return "GroupEntity{" +
                "id=" + id +
                ", userID='" + userID + '\'' +
                ", name='" + name + '\'' +
                ", important=" + important +
                ", groupType=" + groupType +
                ", sortNumber=" + sortNumber +
                '}';
    }
}
