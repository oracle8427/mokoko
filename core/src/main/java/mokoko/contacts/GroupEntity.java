package mokoko.contacts;

public class GroupEntity {

    private int id;
    private String userID;
    private String name;
    private int groupType;
    private int sortNumber;

    public GroupEntity() {

    }

    public GroupEntity(int id, String userID, String name, int groupType, int sortNumber) {
        this.id = id;
        this.userID = userID;
        this.name = name;
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
                ", groupType=" + groupType +
                ", sortNumber=" + sortNumber +
                '}';
    }
}
