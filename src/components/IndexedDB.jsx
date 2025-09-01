 
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
 

export function addUser(username, email, password, avatar) {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      const transaction = db.transaction(["users"], "readwrite");
      const objectStore = transaction.objectStore("users");
      
      // Check if email already exists
      const emailIndex = objectStore.index("email");
      const checkRequest = emailIndex.get(email);
      
      checkRequest.onsuccess = function() {
        if (checkRequest.result) {
          reject("Email already exists");
          return;
        }
        
        // Add new user
        const addRequest = objectStore.add({ username, email, password, avatar });
        
        addRequest.onsuccess = function (event) {
          resolve("User added successfully.");
        };
        
        addRequest.onerror = function (event) {
          reject("Error adding user: " + event.target.error);
        };
      };
      
      checkRequest.onerror = function (event) {
        reject("Database error: " + event.target.error);
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

     
    const user = await usersStore.index('email').get(email);

    if (!user) {
      throw new Error('User not found');
    }

     
    user.username = username;
    user.email = email;
    user.password = newPassword;

     
    await usersStore.put(user);

    return 'Account updated successfully';
  } catch (error) {
    throw new Error('Error updating account: ' + error.message);
  }
}
