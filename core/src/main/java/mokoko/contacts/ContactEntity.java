package mokoko.contacts;

public class ContactEntity {

	private int id;
	private String userID;
	private String fullName;
	private String firstname;
	private String lastname;
	private String nickname;
	private String birth;
	private String organization;
	private String position;
	private int sortNumber;
	private String notes;

	public ContactEntity() {

	}

	public ContactEntity(int id, String userID, String fullName, String firstname, String lastname, String nickname,
						 String birth, String organization, String position, int sortNumber, String notes) {
		this.id = id;
		this.userID = userID;
		this.fullName = fullName;
		this.firstname = firstname;
		this.lastname = lastname;
		this.nickname = nickname;
		this.birth = birth;
		this.organization = organization;
		this.position = position;
		this.sortNumber = sortNumber;
		this.notes = notes;
	}

	public int getId() {
		return id;
	}

	public String getUserID() {
		return userID;
	}

	public String getFullName() {
		return fullName;
	}

	public String getFirstname() {
		return firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public String getNickname() {
		return nickname;
	}

	public String getBirth() {
		return birth;
	}

	public String getOrganization() {
		return organization;
	}

	public String getPosition() {
		return position;
	}

	public int getSortNumber() {
		return sortNumber;
	}

	public String getNotes() {
		return notes;
	}

	@Override
	public String toString() {
		return "ContactEntity{" +
				"id=" + id +
				", userID='" + userID + '\'' +
				", fullName='" + fullName + '\'' +
				", firstname='" + firstname + '\'' +
				", lastname='" + lastname + '\'' +
				", nickname='" + nickname + '\'' +
				", birth='" + birth + '\'' +
				", organization='" + organization + '\'' +
				", position='" + position + '\'' +
				", sortNumber=" + sortNumber +
				", notes='" + notes + '\'' +
				'}';
	}
}
