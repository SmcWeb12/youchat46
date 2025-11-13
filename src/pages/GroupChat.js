import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const GroupChat = ({ user }) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([user.email]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupImage, setGroupImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName || groupMembers.length < 2) {
      alert('Please provide a group name and select at least one other member.');
      return;
    }
    setLoading(true);

    let imageUrl = '';

    if (groupImage) {
      const imageRef = ref(storage, `group_images/${Date.now()}_${groupImage.name}`);
      const uploadTask = uploadBytesResumable(imageRef, groupImage);

      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          console.error('Error uploading image: ', error);
          alert('There was an error uploading the image.');
          setLoading(false);
        },
        async () => {
          imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          createGroup(imageUrl);
        }
      );
    } else {
      createGroup(imageUrl);
    }
  };

  const createGroup = async (imageUrl) => {
    try {
      await addDoc(collection(db, 'groups'), {
        name: newGroupName,
        members: groupMembers,
        image: imageUrl,
        admin: user.email,
        messages: [],
      });
      setNewGroupName('');
      setGroupMembers([user.email]);
      setGroupImage(null);
      alert('Group created successfully! You can now find it on the homepage.');
      navigate('/');
    } catch (e) {
      console.error('Error creating group: ', e);
      alert('There was an error creating the group.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMember = (email) => {
    if (groupMembers.includes(email)) {
      setGroupMembers(groupMembers.filter((member) => member !== email));
    } else {
      setGroupMembers([...groupMembers, email]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setGroupImage(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center py-8 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Create a New Group
        </h1>

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6">
          {/* Group Name Input */}
          <input
            type="text"
            placeholder="Enter new group name"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full p-4 rounded-lg border focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 outline-none transition"
          />

          {/* Group Image Upload */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Group Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg p-2 cursor-pointer"
            />
            {groupImage && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Selected: {groupImage.name}</p>
            )}
          </div>

          {/* Members Selection - Vertical List */}
<div className="mb-6">
  <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Select Members</h3>
  <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
    {users
      .filter((u) => u.email !== user.email)
      .map((u) => (
        <div
          key={u.email}
          onClick={() => handleToggleMember(u.email)}
          className={`flex items-center cursor-pointer p-2 rounded-lg border-2 transition-transform transform hover:scale-105 ${
            groupMembers.includes(u.email)
              ? 'bg-blue-200 border-blue-500 dark:bg-blue-500 dark:text-white'
              : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
          }`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-3">
            <img
              src={u.profileImage || '/path/to/placeholder.jpg'}
              alt={u.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium truncate">{u.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-300 truncate">{u.email}</p>
          </div>
        </div>
      ))}
  </div>
</div>


          {/* Create Button */}
          <button
            onClick={handleCreateGroup}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Creating Group...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
