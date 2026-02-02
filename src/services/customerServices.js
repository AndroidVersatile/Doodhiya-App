import {
    getFirestore,
    doc,
    collection,
    runTransaction,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    getDoc,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import Toast from 'react-native-toast-message';
const db = getFirestore(getApp());
export const addCustomer = async ({ uid, customer }) => {
    const counterRef = doc(db, 'users', uid, 'meta', 'customerCounter');
    const customersRef = collection(db, 'users', uid, 'customers');

    const result = await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);

        let nextNumber = 1;

        if (counterSnap.exists()) {
            nextNumber = counterSnap.data().last + 1;
            transaction.update(counterRef, { last: nextNumber });
        } else {
            transaction.set(counterRef, { last: 1 });
        }

        const customerCode = `CUST${nextNumber
            .toString()
            .padStart(3, '0')}`;

        //  CREATE DOC REF CORRECTLY
        const customerRef = doc(customersRef);

        transaction.set(customerRef, {
            customer_code: customerCode,
            ...customer,
            createdAt: serverTimestamp(),
        });

        //  RETURN VALUE FROM TRANSACTION
        return {
            id: customerRef.id,
            customer_code: customerCode,
            ...customer,
        };
    });

    // ✅ RETURN FROM SERVICE
    return result;
};

/* =========================
   FETCH CUSTOMERS
========================= */
export const getCustomers = async ({ uid }) => {
    const customersRef = collection(db, 'users', uid, 'customers');

    const q = query(customersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));
};

/* =========================
   UPDATE CUSTOMER
========================= */
export const updateCustomer = async ({ uid, customerId, updates }) => {
    const customerRef = doc(db, 'users', uid, 'customers', customerId);

    await updateDoc(customerRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });

    return { customerId, updates };
};

/* =========================
   DELETE CUSTOMER
========================= */
export const deleteCustomer = async ({ uid, customerId }) => {
    const customerRef = doc(db, 'users', uid, 'customers', customerId);

    await deleteDoc(customerRef);

    return customerId;
};
// export const getNextCustomerCode = async (uid) => {
//     const counterRef = doc(db, 'users', uid, 'meta', 'customerCounter');
//     const snap = await getDoc(counterRef);

//     const nextNumber = snap.exists()
//         ? snap.data().last + 1
//         : 1;

//     return `CUST${nextNumber.toString().padStart(3, '0')}`;
// };
export const getNextCustomerCode = async (uid) => {
    try {
        if (!uid) {
            throw new Error('User not authenticated');
        }

        const counterRef = doc(db, 'users', uid, 'meta', 'customerCounter');
        const snap = await getDoc(counterRef);

        const nextNumber = snap.exists()
            ? Number(snap.data().last || 0) + 1
            : 1;

        return `CUST${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
        // console.log('CUSTOMER CODE ERROR:', error);

        Toast.show({
            type: 'info',
            text1: 'Auto Code Unavailable',
            text2: 'Please enter customer code manually.',
        });


        return null;
    }
};