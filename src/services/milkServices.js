import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    query,
    where,
    writeBatch,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

const db = getFirestore(getApp());

/* =========================
   ADD MILK ENTRY
========================= */
export const addMilkEntry = async ({ uid, milk }) => {
    const milkRef = collection(db, 'users', uid, 'milkEntries');

    const docRef = await addDoc(milkRef, {
        ...milk,
        createdAt: serverTimestamp(),
    });

    return {
        id: docRef.id,
        ...milk,
    };
};

/* =========================
   FETCH MILK ENTRIES
========================= */
export const fetchMilkEntries = async ({ uid }) => {
    // console.log('uid in service', uid);
    const milkRef = collection(db, 'users', uid, 'milkEntries');
    const snap = await getDocs(milkRef);

    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};

/* =========================
   UPDATE MILK ENTRY
========================= */
export const updateMilkEntry = async ({ uid, milkId, updates }) => {
    const milkRef = doc(db, 'users', uid, 'milkEntries', milkId);

    await updateDoc(milkRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });

    return { milkId, updates };
};

/* =========================
   DELETE SINGLE MILK ENTRY
========================= */
export const deleteMilkEntry = async ({ uid, milkId }) => {
    const milkRef = doc(db, 'users', uid, 'milkEntries', milkId);
    await deleteDoc(milkRef);
    return milkId;
};

/* =========================
   CASCADE DELETE (CUSTOMER)
========================= */
export const deleteMilkEntriesByCustomer = async ({ uid, customerId }) => {
    const milkRef = collection(db, 'users', uid, 'milkEntries');
    const q = query(milkRef, where('customerId', '==', customerId));
    const snap = await getDocs(q);

    const batch = writeBatch(db);

    snap.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
};
