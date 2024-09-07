import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/Context';

const ProfilePage = () => {
  const { user, setLoading, raiseToast } = useContext(AppContext);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/profile/settings', {
          params: {
            uid: user.uid,
            access_token: user.access_token,
            session: user.session,
          },
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        raiseToast("Failed to fetch profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user.uid && user.access_token && user.session) {
      fetchProfileData();
    }
  }, [user, setLoading, raiseToast]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">UID</label>
          <p className="text-gray-700 text-base">{profile.uid}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <p className="text-gray-700 text-base">{profile.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <p className="text-gray-700 text-base">{profile.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <p className="text-gray-700 text-base">{profile.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <p className="text-gray-700 text-base">{profile.role}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
          <p className="text-gray-700 text-base">{profile.status}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Created</label>
          <p className="text-gray-700 text-base">{new Date(profile.created).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
