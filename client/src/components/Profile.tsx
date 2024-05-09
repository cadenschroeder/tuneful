import { useEffect, useState } from "react";
import { mockData } from "../utils/consts";
import { getLoginCookie } from "../utils/cookie";

interface ProfileProps {
  props: any; // Placeholder, replace or remove as needed
}

const Profile = ({ props }: ProfileProps) => {
  const [sessions, setSessions] = useState<
    { session: string; songs: string[] }[]
  >([]);

  useEffect(() => {
    const fetchSessions = async () => {
      // Fetch user's profile data
      let endpoint = `http://localhost:3232/listLikes?uid=${getLoginCookie()}`;
      const sessions = await fetch(endpoint);
      console.log(endpoint, sessions);
      setSessions(mockData); // TODO: Replace with actual data
    };

    fetchSessions();
  }, []);

  return (
    <div id="profile">
      <h2>Your Profile</h2>
      <ul>
        {sessions.map((data, index) => {
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
