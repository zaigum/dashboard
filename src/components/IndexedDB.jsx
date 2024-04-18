// IndexedDB helper functions

export function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("userData", 1);
  
      request.onerror = function (event) {
        reject("Database error: " + event.target.errorCode);
      };
  
      request.onsuccess = function (event) {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        const objectStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("email", "email", { unique: true });
      };
    });
  }
  
  // IndexedDB.js

export function addUser(username, email, password, avatar) {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(["users"], "readwrite");
      const objectStore = transaction.objectStore("users");
      const request = objectStore.add({ username, email, password, avatar });

      request.onsuccess = function (event) {
        resolve("User added successfully.");
      };

      request.onerror = function (event) {
        reject("Error adding user: " + event.target.error);
      };
    }).catch(error => {
      reject("Database error: " + error);
    });
  });
}

  import { openDB } from 'idb';

export async function updateUserAccount(username, email, newPassword) {
  try {
    const db = await openDB('userData', 1);
    const transaction = db.transaction('users', 'readwrite');
    const usersStore = transaction.objectStore('users');

    // Fetch the user by email
    const user = await usersStore.index('email').get(email);

    if (!user) {
      throw new Error('User not found');
    }

    // Update the user's information
    user.username = username;
    user.email = email;
    user.password = newPassword;

    // Put the updated user back into the database
    await usersStore.put(user);

    return 'Account updated successfully';
  } catch (error) {
    throw new Error('Error updating account: ' + error.message);
  }
}
