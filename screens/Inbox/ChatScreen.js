import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../config/firebase';
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import uuid from 'react-native-uuid';

export default function ChatScreen({ route }) {
  const { threadId, otherId } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const user = getAuth().currentUser;

  useEffect(() => {
    const q = query(
      collection(db, 'messages', threadId, 'chats'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      scrollToEnd();
    });

    return () => unsubscribe();
  }, [threadId]);

  const scrollToEnd = () => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'messages', threadId, 'chats'), {
      sender: user.uid,
      text: input.trim(),
      type: 'text',
      createdAt: serverTimestamp(),
    });

    setInput('');
    scrollToEnd();
  };

  const sendImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const image = result.assets[0].uri;
      const id = uuid.v4();
      const imgRef = ref(storage, `chatImages/${id}.jpg`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(imgRef, blob);
      const imageUrl = await getDownloadURL(imgRef);

      await addDoc(collection(db, 'messages', threadId, 'chats'), {
        sender: user.uid,
        imageUrl,
        type: 'image',
        createdAt: serverTimestamp(),
      });
    }
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender === user.uid;
    return (
      <View
        style={[
          styles.bubble,
          isMe ? styles.mine : styles.theirs,
        ]}
      >
        {item.type === 'image' ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.text}>{item.text}</Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity onPress={sendImage} style={styles.attachBtn}>
          <Text style={styles.icon}>📎</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  mine: {
    backgroundColor: '#FFA500',
    alignSelf: 'flex-end',
  },
  theirs: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sendText: {
    color: '#000',
    fontWeight: 'bold',
  },
  attachBtn: {
    justifyContent: 'center',
  },
  icon: {
    color: '#FFA500',
    fontSize: 20,
  },
});
