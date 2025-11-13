import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase/firebase';
import { doc, getDoc, setDoc, addDoc, collection, query, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';
import { IoArrowBack, IoSend, IoAttach, IoHappy, IoTrash, IoLockClosed } from 'react-icons/io5';
import ProfileView from './ProfileView';
import EmojiPicker from 'emoji-picker-react';

const ChatPage = ({ user }) => {
  const { userId } = useParams();
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProfileViewVisible, setIsProfileViewVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchChatUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setChatUser(userDoc.data());
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchChatUser();

    const chatId = user?.uid < userId ? user?.uid + userId : userId + user?.uid;
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesArr);
    });

    return () => unsubscribe();
  }, [userId, user?.uid, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    const chatId = user.uid < userId ? user.uid + userId : userId + user.uid;

    try {
      const chatDocRef = doc(db, 'chats', chatId);

      if (!(await getDoc(chatDocRef)).exists()) {
        await setDoc(chatDocRef, {
          users: [user.uid, userId],
          lastUpdated: new Date(),
        });
      }

      let fileUrl = null;
      if (file) {
        const fileRef = ref(storage, `chats/${chatId}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Error uploading file:', error);
            setUploadProgress(null);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            fileUrl = downloadURL;
            setUploadProgress(null);
            sendMessageWithFile(fileUrl);
          }
        );
      } else {
        sendMessageWithFile(fileUrl);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendMessageWithFile = async (fileUrl) => {
    const chatId = user.uid < userId ? user.uid + userId : userId + user.uid;

    try {
      const messageData = {
        text: newMessage,
        senderId: user.uid,
        receiverId: userId,
        timestamp: new Date(),
        status: 'sent',
        fileUrl: fileUrl,
        fileType: fileType,
      };

      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
      setNewMessage('');
      setFile(null);
      setFileType(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // 🧠 Convert URLs in message text into clickable links
  const formatMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-200 underline break-words hover:text-yellow-400"
          >
            {part}
          </a>
        );
      }
      return (
        <span key={index} className="break-words">
          {part}
        </span>
      );
    });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleTextAreaChange = (e) => {
    setNewMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const type = selectedFile.type.startsWith('image')
        ? 'image'
        : selectedFile.type === 'application/pdf'
        ? 'pdf'
        : '';
      setFileType(type);
    }
  };

  const deleteMessage = async (messageId) => {
    const chatId = user.uid < userId ? user.uid + userId : userId + user.uid;
    try {
      await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (!chatUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-100">
        <div className="text-xl text-gray-600 animate-pulse">Loading Chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-100 to-indigo-200 relative">
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 backdrop-blur-md z-50">
          <IoLockClosed size={60} className="text-white mb-4" />
          <h2 className="text-white text-2xl font-semibold">Chat Locked</h2>
          <p className="text-gray-300 mt-2">Please login to unlock your messages 🔐</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center shadow-lg">
        <button onClick={() => navigate(-1)} className="mr-4 text-white hover:opacity-80 transition">
          <IoArrowBack size={24} />
        </button>
        <img
          src={chatUser.profileImage || 'https://via.placeholder.com/50'}
          alt={chatUser.name}
          className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
        />
        <div className="ml-4 flex flex-col">
          <span
            className="font-semibold text-white text-lg cursor-pointer hover:underline"
            onClick={() => setIsProfileViewVisible(true)}
          >
            {chatUser.name}
          </span>
          <span className="text-sm text-blue-200">Online</span>
        </div>
      </div>

      {isProfileViewVisible && <ProfileView userId={userId} setIsProfileViewVisible={setIsProfileViewVisible} />}

      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-white/70 to-indigo-100 backdrop-blur-sm">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative max-w-[75%] rounded-2xl px-4 py-2 shadow-md ${
                  message.senderId === user.uid
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-black rounded-bl-none'
                }`}
              >
                {message.fileUrl && message.fileType === 'image' && (
                  <div onClick={() => handleImageClick(message.fileUrl)}>
                    <img
                      src={message.fileUrl}
                      alt="uploaded"
                      className="w-48 h-48 object-cover rounded-xl cursor-pointer mb-2"
                    />
                  </div>
                )}

                {message.fileUrl && message.fileType === 'pdf' && (
                  <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                    <button className="bg-blue-700 text-white py-1 px-3 rounded-md text-sm">Open PDF</button>
                  </a>
                )}

                <div className="text-sm">{formatMessageText(message.text)}</div>

                {message.senderId === user.uid && (
                  <button
                    onClick={() => deleteMessage(message.id)}
                    className="absolute top-1 right-1 text-xs text-red-300 hover:text-red-600 transition"
                  >
                    <IoTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>
      </div>

      <div className="p-4 bg-white flex items-center shadow-inner border-t border-gray-200">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xl text-gray-600 hover:text-blue-500">
          <IoHappy />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-40">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={handleTextAreaChange}
          rows={1}
          className="flex-1 p-2 ml-2 border border-gray-300 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          placeholder="Type a message..."
        />

        {uploadProgress !== null && (
          <div className="w-24 mx-2">
            <div className="bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <input type="file" id="file-input" onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
        <label htmlFor="file-input" className="cursor-pointer text-gray-600 hover:text-blue-500 mx-2">
          <IoAttach size={24} />
        </label>

        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          <IoSend size={24} />
        </button>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-30 flex items-center justify-center">
          <div className="relative">
            <button className="absolute top-2 right-2 text-white text-2xl" onClick={closeImageModal}>
              ×
            </button>
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-screen rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
