package mokoko.contacts;

public class ContactEntity {

    private int id;
    protected String userID;
    private String fullName;
    private String firstname;
    private String lastname;
    private String nickname;
    private String birth;
    private String organization;
    private String position;
    private int sortNumber;
    private String notes;
    private int important;

    public ContactEntity() {

    }

    public ContactEntity(int id, String userID, String fullName, String firstname, String lastname, String nickname,
                         String birth, String organization, String position, int sortNumber, String notes, int important) {
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
        this.important = important;
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

    public int getImportant() {
        return important;
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
                ", important=" + important +
                '}';
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

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
        private int important;

        public ContactEntity build() {
            if (fullName == null || fullName.trim().length() == 0) {
                if (firstname != null && firstname.trim().length() > 0)
                    this.fullName = (lastname == null || lastname.trim().length() == 0) ? firstname : lastname + firstname;
            }
            return new ContactEntity(
                    id, userID, fullName, firstname, lastname,
                    nickname, birth, organization, position, sortNumber,
                    notes, important);
        }


        public Builder id(int id) {
            this.id = id;
            return this;
        }

        public Builder userID(String userID) {
            this.userID = userID;
            return this;
        }

        public Builder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public Builder firstname(String firstname) {
            this.firstname = firstname;
            return this;
        }

        public Builder lastname(String lastname) {
            this.lastname = lastname;
            return this;
        }

        public Builder nickname(String nickname) {
            this.nickname = nickname;
            return this;
        }

        public Builder birth(String birth) {
            this.birth = birth;
            return this;
        }

        public Builder organization(String organization) {
            this.organization = organization;
            return this;
        }

        public Builder position(String position) {
            this.position = position;
            return this;
        }

        public Builder sortNumber(int sortNumber) {
            this.sortNumber = sortNumber;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public Builder important(int important) {
            this.important = important;
            return this;
        }
    }
}
