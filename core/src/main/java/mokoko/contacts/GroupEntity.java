package mokoko.contacts;

public class GroupEntity {

	private int id;
	private int parentID;
	private String userID;
	private String name;
	private int trash;
	private int sortNumber;

	public GroupEntity() {

	}

	public GroupEntity(int id, int parentID, String userID, String name, int trash, int sortNumber) {
		this.id = id;
		this.parentID = parentID;
		this.userID = userID;
		this.name = name;
		this.trash = trash;
		this.sortNumber = sortNumber;
	}

	public int getId() {
		return id;
	}

	public int getParentID() {
		return parentID;
	}

	public String getUserID() {
		return userID;
	}

	public String getName() {
		return name;
	}

	public int getTrash() {
		return trash;
	}

	public int getSortNumber() {
		return sortNumber;
	}
}
