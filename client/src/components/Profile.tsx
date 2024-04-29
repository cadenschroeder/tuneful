import { mockData } from "../utils/consts";

interface ProfileProps {
  props: any; // Placeholder, replace or remove as needed
}

const Profile = ({ props }: ProfileProps) => {
  return (
    <div id="profile">
      <h2>Your Profile</h2>
      <ul>
        {mockData.map((data, index) => {
          const { session, songs } = data;
          return (
            <li key={index}>
              <div className="profile-title">{session}</div>
              <ul>
                {songs.map((song, index) => {
                  return <li key={index}>{song}</li>;
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Profile;
