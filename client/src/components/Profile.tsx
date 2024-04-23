interface ProfileProps {
  props: any; // Placeholder, replace or remove as needed
}

const Profile = ({ props }: ProfileProps) => {
  return (
    <div id="profile">
      <div className="profile-title">Session on 04/21/2024 at 6:00pm</div>
      <div className="profile-song">Song 1</div>
      <div className="profile-song">Song 2</div>
      <div className="profile-song">Song 3</div>
    </div>
  );
};

export default Profile;