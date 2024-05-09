import { useEffect, useState } from "react";
import { getLoginCookie } from "../utils/cookie";

interface ProfileProps {
  props: any; // Placeholder, replace or remove as needed
}

const Profile = ({ props }: ProfileProps) => {
  const [sessions, setSessions] = useState<any>(undefined);

  useEffect(() => {
    let endpoint = `http://localhost:3232/listLikes?uid=${getLoginCookie()}`;
    fetch(endpoint).then((res) => {
      res.json().then((data) => {
        console.log(data.likedSongs);
        setSessions(data.likedSongs);
      });
    });
  }, []);

  const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div id="profile">
      <h2>Your Profile</h2>
      <ul>
        {sessions &&
          sessions.length > 0 &&
          sessions.map((data: string[], index: number) => {
            return (
              <li key={index}>
                <div className="profile-title">
                  {longEnUSFormatter.format(new Date(data[0]))}
                </div>
                <ul>
                  {data.map((song, index) => {
                    if (index === 0) return <></>;
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
